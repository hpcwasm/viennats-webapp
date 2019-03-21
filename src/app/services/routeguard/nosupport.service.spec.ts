import { TestBed } from '@angular/core/testing';

import { NosupportService } from './nosupport.service';

describe('NosupportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NosupportService = TestBed.get(NosupportService);
    expect(service).toBeTruthy();
  });
});
