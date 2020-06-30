/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateExperimentPage } from './create-experiment.page';

describe('CreateExperimentPage', () => {
  let component: CreateExperimentPage;
  let fixture: ComponentFixture<CreateExperimentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExperimentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExperimentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
