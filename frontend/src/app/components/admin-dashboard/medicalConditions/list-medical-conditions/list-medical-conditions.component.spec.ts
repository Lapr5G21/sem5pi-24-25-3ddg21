import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedicalConditionsComponent } from './list-medical-conditions.component';

describe('ListMedicalConditionsComponent', () => {
  let component: ListMedicalConditionsComponent;
  let fixture: ComponentFixture<ListMedicalConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMedicalConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMedicalConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
