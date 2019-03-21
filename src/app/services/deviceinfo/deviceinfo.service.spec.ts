import { TestBed } from '@angular/core/testing';

import { DeviceinfoService } from './deviceinfo.service';

describe('DeviceinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceinfoService = TestBed.get(DeviceinfoService);
    expect(service).toBeTruthy();
  });
});
