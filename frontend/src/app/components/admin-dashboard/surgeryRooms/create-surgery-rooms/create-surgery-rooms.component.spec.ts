import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSurgeryRoomsComponent } from './create-surgery-rooms.component';

describe('CreateSurgeryRoomsComponent', () => {
  let component: CreateSurgeryRoomsComponent;
  let fixture: ComponentFixture<CreateSurgeryRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSurgeryRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSurgeryRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
