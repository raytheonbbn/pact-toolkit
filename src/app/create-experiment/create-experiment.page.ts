/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { Experiment } from '../experiment';
import { ExperimentService } from '../experiment.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.page.html',
  styleUrls: ['./create-experiment.page.scss'],
})
export class CreateExperimentPage implements OnInit {

  experimentInput = {
    title: "",
    description: "",
    distance: "",
    orientation1:  "",
    orientation2: ""
  };

  public sessionUUID: string = "";

  public leader: boolean = true;
  public toEncode: string = null;

  public location: any = null;

  constructor(
    private router: Router,
    public expService: ExperimentService,
    private db: DataService,
    public navCtrl: NavController,
    public device: Device,
    private geolocation: Geolocation,
    public alertController: AlertController,
    private barcodeScanner: BarcodeScanner,
    public loadingController: LoadingController
    ) {}

  async ngOnInit() {
    this.sessionUUID = uuidv4();
    console.log("Creating experiment with a unique ID to be used for matching up data later on ", this.sessionUUID);

    //Get location in the background while user fills out the form
    this.location = await this.getGeolocation();
    console.log("Got location in ngOnInit", this.location);
    
  }

  beginFollower(barcodeData){
    let followerInput;

    try {
      followerInput = JSON.parse(barcodeData.text);
    } catch(e) {
      alert(e);
    }

    //overwrite the one we created
    this.sessionUUID = followerInput.experimentId;
    this.experimentInput.title = followerInput.title;
    this.experimentInput.description = followerInput.description;
    this.experimentInput.distance = followerInput.distance;
    this.experimentInput.orientation1 = followerInput.orientation1;
    this.experimentInput.orientation2 = followerInput.orientation2;
    
    console.log("got experiment settings:");
    console.log(this.experimentInput);

    this.launchExperiment();
  }

  public async createExperimentBarcode() {
    this.experimentInput['experimentId'] = this.sessionUUID;
    this.toEncode = JSON.stringify(this.experimentInput);
  }

  public async beginMaster(){
    //do nothing and launch experiment, launchExperiment blindly takes in set values...
    //...follower sets these values
    this.launchExperiment();
  }
  
  public async launchExperiment(){
    const loading = await this.loadingController.create({
      message: 'Creating experiment...'
    });
    
    await loading.present();
    console.log("Form content: ", this.experimentInput);
    let id = await this.expService.generateKey();

    let exp: Experiment = {
      key: `${id}`,
      experimentUUID: this.sessionUUID,
      title: this.experimentInput.title,
      timestamp: new Date(),
      device: {
        version: this.device.version,
        model: this.device.model,
        manufacturer: this.device.manufacturer,
        id: this.device.uuid,
        serial: this.device.serial
      },
      distance: parseFloat(this.experimentInput.distance),
      orientation1: parseInt(this.experimentInput.orientation1),
      orientation2: parseInt(this.experimentInput.orientation2),
      location: this.location,
      note: this.experimentInput.description,
      completed: false,
      data: []
    };

    //automatically provide title based on ID if empty
    if(this.experimentInput.title == ""){
      exp.title = "Experiment " + exp.key;
    }

    // await this.expService.create(id, exp);
    this.db.addExperiment(id, exp).then((res) => {
      loading.dismiss();
      this.router.navigate(['/recording/' + res.insertId]);
    });

  }

  public scanExperiment(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData);

      this.beginFollower(barcodeData);
    }).catch(err => {
      console.log(err);
    });
  }

  public segmentChanged(e){
    console.log("I am currently the", e.detail.value);
    if(e.detail.value == "leader"){
      this.leader = true;
    }else{
      this.leader = false;
    }
  }

  public cancelCreate() {
    this.navCtrl.navigateBack('/home');
  }

  async displayInputInfo(topic){
    let header, description;

    switch(topic){
      case "distance": {
        header = "Device Distance",
        description = "This is the distance between the two devices in the experiment, measured in meters."
        break;
      }

      case "orientation1": {
        header = "Orientation",
        description = "This is the position of the device on a horizontal plane, with respect to the user. For example, if your device is sitting on a table in front of you, it is at 0° or 'upright'. If the top of the device is pointing to the right, it is at 90°."
        break;
      }

      case "orientation2": {
        header = "Orientation",
        description = "This is the position of the other device on a horizontal plane, with the respect to the same user as this device. For example, if your first device is at 90° and this device is parallel to it, this should also be listed at 90°."
        break;
      }
    }

    const alert = await this.alertController.create({
      header: header,
      message: description,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * @todo Move this method into a service to be used by the create experiment 
   */
  async getGeolocation() {
    let geoOptions = {
      maximumAge: 3000,
      timeout: 5000,
      enableHighAccuracy: true
    }

    let position, serialized_pos;

    try {
      position = await this.geolocation.getCurrentPosition(geoOptions);
      serialized_pos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
        address: ""
      };
    } catch (e) {
      console.log(e);
      serialized_pos = {};
    }

    console.log(serialized_pos);
    return serialized_pos;
  }

}
