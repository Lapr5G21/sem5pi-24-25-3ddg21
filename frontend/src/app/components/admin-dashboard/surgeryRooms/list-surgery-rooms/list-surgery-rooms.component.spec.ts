import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSurgeryRoomsComponent } from './list-surgery-rooms.component';

describe('ListSurgeryRoomsComponent', () => {
  let component: ListSurgeryRoomsComponent;
  let fixture: ComponentFixture<ListSurgeryRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSurgeryRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSurgeryRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
