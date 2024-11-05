import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationTypesComponent } from './create-operation-types.component';

describe('CreateOperationTypesComponent', () => {
  let component: CreateOperationTypesComponent;
  let fixture: ComponentFixture<CreateOperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperationTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
