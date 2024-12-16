import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalRecordsComponent } from './create-medical-records.component';

describe('CreateMedicalRecordsComponent', () => {
  let component: CreateMedicalRecordsComponent;
  let fixture: ComponentFixture<CreateMedicalRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicalRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicalRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
