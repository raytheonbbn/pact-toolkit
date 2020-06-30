/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Experiment } from '../experiment';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public experiments: Array<Experiment> = [];
  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private db: DataService
    ) {}

  async ngOnInit(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
      result => console.log('Has permission BLUETOOTH_ADMIN?',result.hasPermission)
    );

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH).then(
      result => console.log('Has permission BLUETOOTH?',result.hasPermission)
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN, this.androidPermissions.PERMISSION.BLUETOOTH, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
    console.log("initialized!");
  }

  async ionViewWillEnter(){    
    this.db.getDatabaseState().subscribe((res) => {
      if(res){
        this.db.getExperiments().subscribe(items => {
          this.experiments = items;
          this.experiments = this.experiments.sort((a, b) => (new Date(b.timestamp).getTime()) - (new Date(a.timestamp).getTime()));
          
          console.log("Experiment data on device: ", items);
        })
      }
    });
  }

  showExperiment(experimentId){
    this.navCtrl.navigateForward('/read-experiment/' + experimentId);
  }

  openMenu() {
    this.menu.open();
  }
}
