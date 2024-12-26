import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomTypesComponent } from './create-room-types.component';

describe('CreateRoomTypesComponent', () => {
  let component: CreateRoomTypesComponent;
  let fixture: ComponentFixture<CreateRoomTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoomTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoomTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
