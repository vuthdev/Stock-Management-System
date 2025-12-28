import { TestBed } from '@angular/core/testing';

import { Productdata } from './productdata';

describe('Productdata', () => {
  let service: Productdata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Productdata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
