/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRCodeModule } from 'angularx-qrcode';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
 
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, QRCodeModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    BluetoothLE,
    AndroidPermissions,
    Device,
    StatusBar,
    SplashScreen,
    Geolocation,
    File,
    FileOpener,
    BarcodeScanner,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },    
    SQLite,
    SQLitePorter
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
