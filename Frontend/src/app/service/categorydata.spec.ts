import { TestBed } from '@angular/core/testing';

import { Categorydata } from './categorydata';

describe('Categorydata', () => {
  let service: Categorydata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Categorydata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
