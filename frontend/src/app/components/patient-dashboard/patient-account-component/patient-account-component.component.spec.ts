import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAccountComponent } from './patient-account-component.component';
import { HttpClientModule } from '@angular/common/http';

describe('PatientAccountComponent', () => {
  let component: PatientAccountComponent;
  let fixture: ComponentFixture<PatientAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAccountComponent,HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
