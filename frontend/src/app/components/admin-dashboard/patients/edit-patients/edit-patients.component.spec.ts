import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientsComponent } from './edit-patients.component';

describe('EditPatientsComponent', () => {
  let component: EditPatientsComponent;
  let fixture: ComponentFixture<EditPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
