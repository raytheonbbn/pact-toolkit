/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component, Injectable, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { environment as ENV } from '../../environments/environment';
import { Experiment } from '../experiment';
import { ExperimentService } from '../experiment.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.page.html',
  styleUrls: ['./recording.page.scss'],
})
@Injectable()
export class RecordingPage implements OnInit {

  public SCANNING_RUNTIME_MILLIS: number = 10000;
  public ADVERTISING_RUNTIME_MILLIS: number = 30000;
  public SERVICE_UUID: string = ENV.BLE_ADVERTISEMENT_SERVICE_UUID;

  private experimentId: string = null;
  private experiment: Experiment = null;

  //arbitrary UUID for characteristic
  public characteristicUUID: string = '2f21fd0b-5d9d-4bec-b8c0-0833e26c213d';

  private devices: any[] = [];
  private statusMessage: String = "";

  public advertising: boolean = false;
  public firstAdvertisementReceived: boolean = false;

  private scanParams: any = {
    "services": [
      this.SERVICE_UUID
    ],
    "allowDuplicates": true,
    "scanMode": this.bluetoothle.SCAN_MODE_LOW_POWER,
    "matchMode": this.bluetoothle.MATCH_MODE_AGGRESSIVE,
    "matchNum": this.bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
    "callbackType": this.bluetoothle.CALLBACK_TYPE_ALL_MATCHES,
    "isConnectable": true
  };

  constructor(
    private bluetoothle: BluetoothLE,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
    private exp: ExperimentService,
    private db: DataService,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public platform: Platform) {}

  setStatus(message: String){
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  async alertUser(message: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.experimentId = this.activatedRoute.snapshot.paramMap.get('experimentId');
    // this.experiment = await this.exp.readFromId(this.experimentId);

    this.db.getDatabaseState().subscribe((res) => {
      if(res){
        console.log("Db ready", res);

        console.log("Getting experiment data for recording with ID of " + this.experimentId)
        this.db.getExperiment(this.experimentId).then(res => {
          console.log("Got experiment for recording: ");
          console.log(res);
    
          this.experiment = res;
    
          if (this.experiment == null) {
            console.error(`Experiment with ID ${this.experimentId} does not exist, navigating home`);
            this.navigateHome();
          }else{
            this.platform.ready().then((readySource) => {
              console.log('Platform ready from', readySource);
        
              this.bluetoothle.initialize().subscribe(
                ble => {
                  console.log("BLE initialized", ble);
        
                  //initialize BLE peripheral mode
                  this.startAdvertisingPeripheral();
        
                  this.alertUser("Waiting for other PACT device..."); //...before I start scanning
        
                  //then initialize as central
                  this.startScanningForDevices();
                  this.setStatus("Scanning for a PACT device");
                },
                error => {
                  this.handleBleInitializeError(error);
                }
              );
            });
          }
    
        });
        
      }
    });
  }

  async handleBleInitializeError(error: string) {
    if(error == "cordova_not_available"){
      console.log("Cordova is not available - are you running in the browser or on a device?");

      //TODO: store this dummy data for development purposes as a JSON resource
      this.devices = [{"address":"75:95:AA:44:38:5A","advertising":{},"rssi":-87,"timestamp":1589892151548}, {"address":"22:68:B7:5B:35:3E","advertising":{},"rssi":-83,"timestamp":1589892151587}, {"address":"50:3B:C7:E5:36:0B","advertising":{},"rssi":-39,"timestamp":1589892151645}, {"address":"46:CA:1D:89:7D:E0","advertising":{},"rssi":-62,"timestamp":1589892151667}, {"address":"CA:D3:BE:30:DE:E5","advertising":{},"rssi":-79,"timestamp":1589892152455}, {"address":"1C:1A:C0:69:75:35","advertising":{},"rssi":-97,"timestamp":1589892155981}, {"address":"12:A3:BC:6D:3B:4B","advertising":{},"rssi":-98,"timestamp":1589892160873}];
    }else{
      this.setStatus("Error " + error);
      console.log(error);
      let toast = await this.toastCtrl.create({
        message: "Error initializing BLE! Check app permissions",
        position: "middle",
        duration: 5000
      });
      toast.present();
    }
  }

  startScanningForDevices() {
    console.log("Starting scanning for BLE devices");
    this.bluetoothle.startScan(this.scanParams).subscribe(
      result => {
        if(result["status"] == "scanResult"){
          this.handleScanResult(result);
        }else{
          console.log("Message from bluetooth startScan", result);
        }
      },
      error => {
        console.log(error);
      });
  }

  handleScanResult(device: any): void{
    console.log("Discovered device: " + JSON.stringify(device, null, 2));

    if(this.firstAdvertisementReceived){ //ignore the first one, but start the experiment
      this.ngZone.run(() => {
        device["timestamp"] =  Date.now();
        this.devices.push(device);
      });     
    }else{
      this.firstAdvertisementReceived = true;
      this.bluetoothle.stopScan().then((res)=>{
        console.log("Stopped scanning for devices, will re-start for experiment recording");
      });

      console.log("First time seeing a PACT device ", device);
      this.startExperimentRecording();
    }
  }

  async startExperimentRecording(){
    this.alertUser("Found device. Starting experiment!");
    const recordingIndicatorDialog = await this.loadingController.create({
      message: 'Recording data...'
    });
    await recordingIndicatorDialog.present();
    this.setStatus("Scanning for BLE devices");

    console.log("Experiment Recording: Started Scanning");
    this.startScanningForDevices();

    setTimeout(() => {
      this.bluetoothle.stopScan().then(
        res => {
          this.endExperiment();
          recordingIndicatorDialog.dismiss();
        },
        error => {
          console.log(error);
          this.setStatus("Stop scan failed: " + error)
        }
      )
    }, this.SCANNING_RUNTIME_MILLIS);

    setTimeout(() => {
      this.stopAdvertising();
    }, this.ADVERTISING_RUNTIME_MILLIS);
  }

  definePeripheral(){
    let peripheralParams = {
      "request": true,
      "restoreKey": "pact-test-1"
    };

    return new Promise((resolve, reject) => {
      this.bluetoothle.initializePeripheral(peripheralParams).subscribe(periEvent => {
        if (periEvent.status == 'enabled') {
          this.addPeripheralService().then(res => {
            resolve(res);
          }), err => {
            console.log(err);
            reject(err);
          };
        }

        if(periEvent.status == 'readRequested') {
          //respond with bluetoothle.respond(...)
        }

        if(periEvent.status == 'writeRequested') {
          //respond with bluetoothle.respond(...)
        }  
      }, err => {
        console.log(err);
      });  
    });
  }

  addPeripheralService(){
    var serviceParams = {
      service: this.SERVICE_UUID,
      characteristics: [
        {
          uuid: this.characteristicUUID,
          permissions: {
            read: true,
            write: true,
            writeWithoutResponse: true
          },
          properties: {
            read: true,
            writeWithoutResponse: true,
            write: true,
            notify: true,
            indicate: true
          }
        }
      ]
    };

    return this.bluetoothle.addService(serviceParams);    
  }

  startAdvertisingPeripheral() {
    let params = {
      service: this.SERVICE_UUID, //android
      services: [
        this.SERVICE_UUID //ios
      ],
      name: "PACT",
      manufacturerId: 0xFD6F,
      connectable: true,
      timeout: 0,
      includeDeviceName: false,
      includeTxPowerLevel: true
    };

    this.definePeripheral().then(
      (result) => {
        console.log("Peripheral defined", result);

        this.bluetoothle.isAdvertising().then((result) => {
          // if (result['isAdvertising']) {
            // console.log("Device is already advertising", result['isAdvertising']);
            // this.alertUser("Device is already advertising!");
          // } else {
            console.log("We don't care if device is already advertising (" + result['isAdvertising'] + ") - calling startAdvertising anyway!");

            this.bluetoothle.startAdvertising(params).then(status => {
              console.log("BLE Advertising: Started ", status);
              this.alertUser("Advertising to PACT devices started!");
              this.advertising = true;
            }).catch(err => console.log(err));
          // }
        }, 
      (error) => {
          console.log(error);
          this.alertUser(JSON.stringify(error));
        });
      });
  }

  stopAdvertising() {
    this.bluetoothle.stopAdvertising().then(status => {
      console.log("BLE advertising: Stopped", status);
      this.advertising = false;

    }).catch(err => console.log(err));
  }

  endExperiment() {
    console.log("Experiment Recording: Stopped Scanning");
    this.setStatus("Stopped recording");
    this.saveExperimentResults();
  }

  saveExperimentResults(){
    this.experiment.data = this.devices;

    // await this.exp.update(this.experiment);
    this.db.updateExperiment(this.experimentId, this.experiment).then((res) => {
      console.log("Updated...");
    })

    this.ngZone.run(() => {
      this.navCtrl.navigateRoot('/read-experiment/' + this.experimentId);
    });
  }

  navigateHome(){
    this.stopAdvertising();
    this.bluetoothle.stopScan().then((res)=>{
      console.log("Stopped scanning, exiting");
    });    
    
    this.navCtrl.navigateRoot("/home");
  }
}
