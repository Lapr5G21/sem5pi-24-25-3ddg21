import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MedicalConditionService } from './medical-condition.service';

describe('MedicalConditionService', () => {
  let service: MedicalConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule] 
    });
    service = TestBed.inject(MedicalConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
