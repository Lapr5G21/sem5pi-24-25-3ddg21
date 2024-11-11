import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalModelComponent } from './hospital-model.component';

describe('HospitalModelComponent', () => {
  let component: HospitalModelComponent;
  let fixture: ComponentFixture<HospitalModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
