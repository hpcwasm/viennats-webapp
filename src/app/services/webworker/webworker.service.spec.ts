import { TestBed } from '@angular/core/testing';

import { WebworkerService } from './webworker.service';

describe('WebworkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebworkerService = TestBed.get(WebworkerService);
    expect(service).toBeTruthy();
  });
});
