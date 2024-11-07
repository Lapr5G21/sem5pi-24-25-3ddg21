import { TestBed } from '@angular/core/testing';

import { OperationRequestService } from './operation-request.service';

describe('OperationRequestService', () => {
  let service: OperationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
