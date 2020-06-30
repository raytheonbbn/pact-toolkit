/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportPageRoutingModule } from './export-routing.module';

import { ExportPage } from './export.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExportPageRoutingModule
  ],
  declarations: [ExportPage]
})
export class ExportPageModule {}
