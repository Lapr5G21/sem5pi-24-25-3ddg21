import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperationTypesComponent } from './list-operation-types.component';
import { HttpClientModule } from '@angular/common/http';

describe('ListOperationTypesComponent', () => {
  let component: ListOperationTypesComponent;
  let fixture: ComponentFixture<ListOperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOperationTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
