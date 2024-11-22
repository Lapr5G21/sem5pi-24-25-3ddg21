import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStaffsComponent } from './list-staffs.component';
import { HttpClientModule } from '@angular/common/http';

describe('ListStaffsComponent', () => {
  let component: ListStaffsComponent;
  let fixture: ComponentFixture<ListStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStaffsComponent,HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
