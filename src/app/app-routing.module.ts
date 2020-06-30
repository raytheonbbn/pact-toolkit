/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'create-experiment',
    loadChildren: () => import('./create-experiment/create-experiment.module').then( m => m.CreateExperimentPageModule)
  },
  {
    path: 'recording/:experimentId',
    loadChildren: () => import('./recording/recording.module').then( m => m.RecordingPageModule)
  },
  {
     path: 'debug',
     loadChildren: () => import('./debug/debug.module').then( m => m.DebugPageModule)
  },
  {
    path: 'read-experiment/:experimentId',
    loadChildren: () => import('./read-experiment/read-experiment.module').then( m => m.ReadExperimentPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'debug',
    loadChildren: () => import('./debug/debug.module').then( m => m.DebugPageModule)
  },
  {
    path: 'export',
    loadChildren: () => import('./export/export.module').then( m => m.ExportPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
