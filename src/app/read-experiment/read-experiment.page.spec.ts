/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadExperimentPage } from './read-experiment.page';

describe('ReadExperimentPage', () => {
  let component: ReadExperimentPage;
  let fixture: ComponentFixture<ReadExperimentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadExperimentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadExperimentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
