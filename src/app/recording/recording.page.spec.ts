/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecordingPage } from './recording.page';

describe('RecordingPage', () => {
  let component: RecordingPage;
  let fixture: ComponentFixture<RecordingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
