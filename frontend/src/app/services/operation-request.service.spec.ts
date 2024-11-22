import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Importa o HttpClientModule

import { OperationRequestService } from './operation-request.service';

describe('OperationRequestService', () => {
  let service: OperationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule] 
    });
    service = TestBed.inject(OperationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
