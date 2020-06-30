/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadExperimentPageRoutingModule } from './read-experiment-routing.module';

import { ReadExperimentPage } from './read-experiment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadExperimentPageRoutingModule
  ],
  declarations: [ReadExperimentPage]
})
export class ReadExperimentPageModule {}
