/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

import { CreateExperimentPageRoutingModule } from './create-experiment-routing.module';

import { CreateExperimentPage } from './create-experiment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    CreateExperimentPageRoutingModule
  ],
  declarations: [CreateExperimentPage]
})
export class CreateExperimentPageModule {}
