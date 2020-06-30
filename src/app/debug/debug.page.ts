/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component, OnInit } from '@angular/core';
import { BluetoothLE, InitializeResult } from '@ionic-native/bluetooth-le/ngx';
import { ToastController } from '@ionic/angular';

import { Platform } from '@ionic/angular';

/**
 * For engineering use only
 *
 * Based on docs and information at https://github.com/randdusing/cordova-plugin-bluetoothle
 */

@Component({
  selector: 'app-debug',
  templateUrl: './debug.page.html',
  styleUrls: ['./debug.page.scss'],
})
export class DebugPage implements OnInit {

  //arbitrary UUID for service
  public serviceUUID: string = 'ebc42d85-ca4a-4d96-b706-49c65aa8cecc';

  //arbitrary UUID for characteristic
  public characteristicUUID: string = '2f21fd0b-5d9d-4bec-b8c0-0833e26c213d';

  //boolean to track state
  public advertising: boolean = false;

  //informs user of state of advertising
  public advertisingInfo: String = "Stopped";

  constructor(public toastController: ToastController, public bluetoothle: BluetoothLE, public plt: Platform) {
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);

     });
  }

  /**
   * Helper method to display informational toast to user
   *
   * @param message message to display to use
   */
  async alertUser(message){
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
  }

  /**
   * Entry point for advertising, begins the "peripheral life cycle" defined the library docs
   *
   * Peripheral Life Cycle
   * 1. initializePeripheral
   * 2. addService
   * 3. startAdvertising
   * 4. Listen for events on initializePeripheral callback
   * 5. Respond to events using respond or notify
   * 6. stopAdvertising
   * 7. removeService / removeAllServices
   *
   *
   */
  initializeBLE(){
    //step 0 (Android needs initialize first)
    this.bluetoothle.initialize().subscribe(
      ble => {console.log(ble);
        //step 1
        this.initializePeripheral();
      },
      error => {
        if (error == "cordova_not_available") {
          this.alertUser("Cordova is not available");
          console.log(error);
        }else{
          console.log(error);
        }
      }
    );
  }

  /**
   * Method which says that we want to use our device as a BLE peripheral (not central) and begin advertising
   */
  initializePeripheral() {
    let params = {
      "request": true,
      "restoreKey": "pact-test-1"
    };

    this.bluetoothle.initializePeripheral(params).subscribe(res => {
      this.alertUser(JSON.stringify(res));

      if (res.status == 'enabled') {
        //step 2
        this.addService();
      }

      //step 4+5 technically goes here, to listen for events and do something more

    }, err => {
      console.log(err);
    });
  }

  /**
   * Method which defines the service parameters and adds this service to our peripheral
   */
  addService(){
    var serviceParams = {
      service: this.serviceUUID,
      characteristics: [
        {
          uuid: this.characteristicUUID,
          permissions: {
            read: true,
            write: true,
            writeWithoutResponse: true
            //readEncryptionRequired: true,
            //writeEncryptionRequired: true,
          },
          properties: {
            read: true,
            writeWithoutResponse: true,
            write: true,
            notify: true,
            indicate: true,
            //authenticatedSignedWrites: true,
            //notifyEncryptionRequired: true,
            //indicateEncryptionRequired: true,
          }
        }
      ]
    };

    this.bluetoothle.addService(serviceParams).then(res => {
      console.log(res);
      console.log("bluetoothle is advertising?...");
      this.bluetoothle.isAdvertising().then(
        (result) => { //resolved
          console.log("Check advertising result: ");
          console.log(result);

          if(result['isAdvertising'] == true){
            //do nothin
            console.log("already advertising...");
            console.log(result['isAdvertising']);
          }else{
            console.log("not yet advertising.");
            console.log(result['isAdvertising']);

            //step 3
            this.startAdvertising();
          }
          this.alertUser(JSON.stringify(result));
        },
        (error) => { //rejected
          console.log(error);
          this.alertUser(JSON.stringify(error));
        }
      );
    }, err => {
      console.log(err);
    })
  }

  /**
   * Method which defines the advertising parameters and begins the BLE advertisement
   */
  startAdvertising() {
    let params = {
      service: this.serviceUUID, //android
      services: [
        this.serviceUUID //ios
      ],
      name: "PACT",
      manufacturerId: 0xFD6F,
      connectable: true,
      timeout: 0,
      includeDeviceName: false,
      includeTxPowerLevel: true
    };

    this.bluetoothle.startAdvertising(params).then(status => {
      console.log(status);
      this.alertUser("Advertising started");
      this.advertisingInfo = "Look for the following service UUID: " + this.serviceUUID + "."
      this.advertising = true;
    }).catch(err => console.log(err));
  }

  /**
   * Stops advertising and sets the runtime state to false
   */
  stopAdvertising() {
    this.bluetoothle.stopAdvertising().then(status => {
      console.log(status);
      this.advertising = false;

    }).catch(err => console.log(err));
  }

  /**
   * A helper method called from the UI to let the user know things are working as expected
   */
  checkAdvertising(){
    this.bluetoothle.isAdvertising().then(
      (result) => { //resolved
        console.log("Check advertising result: ");
        console.log(result);
        this.alertUser(JSON.stringify(result));
      },
      (error) => { //rejected
        console.log(error);
        this.alertUser(JSON.stringify(error));
      }
    )};


  ngOnInit() {
  }
}
