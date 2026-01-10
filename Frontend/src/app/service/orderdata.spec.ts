import { TestBed } from '@angular/core/testing';

import { Orderdata } from './orderdata';

describe('Orderdata', () => {
  let service: Orderdata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Orderdata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
