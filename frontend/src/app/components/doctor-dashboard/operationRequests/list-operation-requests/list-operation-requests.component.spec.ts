import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperationRequestsComponent } from './list-operation-requests.component';

describe('ListOperationRequestsComponent', () => {
  let component: ListOperationRequestsComponent;
  let fixture: ComponentFixture<ListOperationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOperationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
