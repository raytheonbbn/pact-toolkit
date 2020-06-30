/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController, Platform } from '@ionic/angular';
import { Experiment } from '../experiment';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';
import { ExportPage } from '../export/export.page';


@Component({
  selector: 'app-read-experiment',
  templateUrl: './read-experiment.page.html',
  styleUrls: ['./read-experiment.page.scss'],
})
export class ReadExperimentPage implements OnInit {

  public experimentId: string = null;
  public experiment: Experiment = null;

  constructor(private activatedRoute: ActivatedRoute,
      public navCtrl: NavController,
      public db: DataService,
      private platform: Platform,
      public file: File,
      private fileOpener: FileOpener,
      public socialSharing: SocialSharing,
      public modalCtrl: ModalController) { }

  ngOnInit() {
    this.experimentId = this.activatedRoute.snapshot.paramMap.get('experimentId');
    console.log(`Displaying experiment with key ${this.experimentId}`);
    this.db.getDatabaseState().subscribe((res) => {
      if(res){
        // this.experiment = await this.exp.readFromId(this.experimentId);
        this.db.getExperiment(this.experimentId).then(res => {
          this.experiment = res;

          if(this.experiment != null){
            console.log("Experiment content ", this.experiment);
          }else{
            console.log(`Experiment ${this.experimentId} does not exist!`);
            this.navigateHome();
          }
        });
      }
    });
  }

  async share(){
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(()=> {
      // Sharing via email is possible
          // Share via email
          this.socialSharing.shareViaEmail(JSON.stringify(this.experiment), 'PACT Experiment Results', ['pact-data@example.org']).then(() => {
            // Success!
          }).catch(() => {
            // Error!
          });
    }).catch((e) => {
      // Sharing via email is not possible
      console.log("Email sharing is not available:");
      console.log(e);
    });
  }

  navigateHome(){
    this.navCtrl.navigateRoot("/home");
  }

  deleteExperiment(){
    this.db.deleteExperiment(this.experimentId).then((result) => {
      console.log(result);
    });
    this.navigateHome();
  }

  async exportExperimentData(){
    const filename = this.experimentId + ".txt";
    const csv = this.createCSVfromExperiment(this.experiment);

    if (this.platform.is('cordova')){
      //this.downloadCSVtoDevice(csv, filename);
      this.downloadJSONtoDevice(this.experiment, filename);
    }else{
      this.downloadCSVtoBrowser(csv, filename);
    }
  }

  downloadCSVtoBrowser(csv: string, filename: string){
    console.log("Downloading experiment data CSV via browser");

    let blob = new Blob([csv]);
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public async openExportModal(){
    const modal = await this.modalCtrl.create({
      component: ExportPage ,
      componentProps: {
        "experiment": this.experiment
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }    

  downloadCSVtoDevice(csv: string, filename: string){
    console.log("Downloading experiment data CSV via file writer to device");

    this.file.writeFile(this.file.dataDirectory, filename, csv)
    .then((resp)=> {
      this.fileOpener.open(resp.nativeURL, 'text/csv')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  downloadJSONtoDevice(experimentJson: Experiment, filename: string){
    let blob = new Blob([JSON.stringify(experimentJson)],  { type: "text/plain" });

    this.file.writeFile(this.file.dataDirectory, filename, blob, {
      replace: true,
      append: false
    })
    .then((resp)=> {
      console.log("Wrote file:", resp);
      this.fileOpener.open(resp.nativeURL, "text/plain")
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  createCSVfromExperiment(experimentJson: Experiment): string {
    const numOfItems = experimentJson.data.length;
    let csvOutput: string = "Timestamp, MAC Address, RSSI\r\n";

    for (let i = 0; i < numOfItems; i++) {
      let row = "";
      row += experimentJson.timestamp + ',';
      row += experimentJson.data[i].address + ',';
      row += experimentJson.data[i].rssi + ',';
      csvOutput += row + '\r\n'
    }

    return csvOutput;
  }
}
