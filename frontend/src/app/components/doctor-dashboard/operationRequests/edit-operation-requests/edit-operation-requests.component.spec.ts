import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperationRequestsComponent } from './edit-operation-requests.component';

describe('EditOperationRequestsComponent', () => {
  let component: EditOperationRequestsComponent;
  let fixture: ComponentFixture<EditOperationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOperationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
