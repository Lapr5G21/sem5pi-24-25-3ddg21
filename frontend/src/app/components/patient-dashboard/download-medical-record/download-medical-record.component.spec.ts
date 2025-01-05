import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMedicalRecordComponent } from './download-medical-record.component';

describe('DownloadMedicalRecordComponent', () => {
  let component: DownloadMedicalRecordComponent;
  let fixture: ComponentFixture<DownloadMedicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadMedicalRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
