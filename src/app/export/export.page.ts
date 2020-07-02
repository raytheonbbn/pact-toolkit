/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { Experiment } from '../experiment';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  experiment: Experiment;

  exportOptions = {
    format: "mit",
    target: "email_pact"
  };

  fileLocation = "";
  shareMessage = "This is an automatically generated message containing the results of a PACT Bluetooth Experiment for research purposes. Please see the attached file.";

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public file: File,
    public socialSharing: SocialSharing,
    private fileOpener: FileOpener,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.experiment = this.navParams.data.experiment;
    console.log(this.experiment);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async exportData(){
    let filename = this.experiment.key + "_" + new Date(this.experiment.timestamp).getTime() + ".json";
    let experimentJson = this.experiment;

    let json = await this.formatData(experimentJson, this.exportOptions.format);

    this.downloadJSONtoDevice(json, filename).then(() => {
      console.log("Done saving!");
      if(this.exportOptions.target == "device"){
        //download to device, call it a day
        this.alertUser("Saved", "Experiment saved to device storage at: " + this.fileLocation)
        this.closeModal();
  
      }else if(this.exportOptions.target == "email_pact"){
        //download and attach to email with preconfigured message
        this.shareToEmail("pactdatasets@gmail.com");
  
      }else if(this.exportOptions.target == "email_custom"){
        //download and attach to email no dest
        this.shareToEmail();
      }
    });
  }

  formatData(experimentJson, format){
    let json = {};

    if(format == "bbn"){
      //get experiment JSON "as is"
      json = experimentJson;

    }else if(format == "mit"){
      //get experiment JSON and transform it
      let bluetoothArray = [];

      experimentJson.data.forEach(entry => {
        bluetoothArray.push(
          {
            "timestamp": entry.timestamp,
            "rssi": entry.rssi,
            "mac_address": entry.address
        })
      });

      let experimentJsonMIT = {
        "schema_ver": "3",
        "schema_name": "MIT-Proximity-Upload",
        "app_data": {
          "app_name": "PACT Toolkit",
          "app_ver": "v0.0.1"
        },
        "session_data": [
          {
            "session_id": experimentJson.experimentUUID,
            "setup_num": "0",
            "setup_last": "true",
            "setup_start_time": "<TIMESTAMP: When setup data collection began>",
            "setup_end_time": "<TIMESTAMP: When setup data collection ended>",
            "test_type": "Free form",
            "participants": {
              "bt_beacon": {
                "beacon_id": "<STRING: Unique beacon id, perhaps a real UUID>",
                "station_id": "<OPTIONAL STRING: ID of the calibration station that hosts the beacon"
              },
              "self": {
                "id": experimentJson.device.id,
                "device_model ": experimentJson.device.model,
                "dist_ft": (experimentJson.distance * 3.281)
              }
            },
            "sensor_data": {
              "bluetooth": bluetoothArray
            }
          }
        ]
      }

      json = experimentJsonMIT;
      console.log("Done ", json);
      return json;
    }    
  }

  downloadJSONtoDevice(experimentJson: any, filename: string){
    let blob = new Blob([JSON.stringify(experimentJson)],  { type: "text/plain" });

    return this.file.writeFile(this.file.dataDirectory, filename, blob, {
      replace: true,
      append: false
    })
    .then((resp)=> {
      console.log("Wrote file:", resp);
      this.fileLocation = resp.nativeURL     
    })
    .catch((err) => {
      console.log(err);
    });
  }

  shareToEmail(email?: string){
    let destinations = [];

    if(email)
      destinations.push(email);

    this.socialSharing.canShareViaEmail().then(()=> {
        this.socialSharing.shareViaEmail(
          this.shareMessage,
          'PACT Experiment Results', 
          destinations,
          [],
          [],
          this.fileLocation
        ).then(() => {
          console.log("Successfully shared");
          this.closeModal();

        }).catch(() => {
          // Error!
        });
    }).catch((e) => {
      console.log("Email sharing is not available:");
      console.log(e);
    });
  }

  async alertUser(title, message){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
