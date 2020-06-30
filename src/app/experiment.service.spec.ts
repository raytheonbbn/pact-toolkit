/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { TestBed } from '@angular/core/testing';

import { ExperimentService } from './experiment.service';

describe('ExperimentService', () => {
  let service: ExperimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
