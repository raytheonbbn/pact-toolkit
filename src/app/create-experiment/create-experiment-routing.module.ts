/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateExperimentPage } from './create-experiment.page';

const routes: Routes = [
  {
    path: '',
    component: CreateExperimentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateExperimentPageRoutingModule {}
