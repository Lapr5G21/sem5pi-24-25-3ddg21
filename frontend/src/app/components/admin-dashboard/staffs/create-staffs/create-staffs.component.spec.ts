import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffsComponent } from './create-staffs.component';

describe('CreateStaffsComponent', () => {
  let component: CreateStaffsComponent;
  let fixture: ComponentFixture<CreateStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
