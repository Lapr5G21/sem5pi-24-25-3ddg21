import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalConditionsComponent } from './create-medical-conditions.component';

describe('CreateMedicalConditionsComponent', () => {
  let component: CreateMedicalConditionsComponent;
  let fixture: ComponentFixture<CreateMedicalConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicalConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicalConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
