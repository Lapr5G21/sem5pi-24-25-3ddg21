import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDashboardComponent } from './patient-dashboard.component';
import { HttpClientModule } from '@angular/common/http';

describe('PatientDashboardComponent', () => {
  let component: PatientDashboardComponent;
  let fixture: ComponentFixture<PatientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDashboardComponent,HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
