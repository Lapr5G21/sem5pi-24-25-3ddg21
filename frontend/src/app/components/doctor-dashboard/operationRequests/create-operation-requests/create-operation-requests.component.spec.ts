import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationRequestsComponent } from './create-operation-requests.component';
import { HttpClientModule } from '@angular/common/http';

describe('CreateOperationRequestsComponent', () => {
  let component: CreateOperationRequestsComponent;
  let fixture: ComponentFixture<CreateOperationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
