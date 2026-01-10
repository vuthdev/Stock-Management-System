import { TestBed } from '@angular/core/testing';

import { Sidebartoggle } from './sidebartoggle';

describe('Sidebartoggle', () => {
  let service: Sidebartoggle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sidebartoggle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
