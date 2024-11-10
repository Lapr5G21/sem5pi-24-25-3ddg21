import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStaffsComponent } from './edit-staffs.component';

describe('EditStaffsComponent', () => {
  let component: EditStaffsComponent;
  let fixture: ComponentFixture<EditStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStaffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
