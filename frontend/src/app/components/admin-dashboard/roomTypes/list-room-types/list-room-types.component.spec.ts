import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoomTypesComponent } from './list-room-types.component';

describe('ListRoomTypesComponent', () => {
  let component: ListRoomTypesComponent;
  let fixture: ComponentFixture<ListRoomTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRoomTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRoomTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
