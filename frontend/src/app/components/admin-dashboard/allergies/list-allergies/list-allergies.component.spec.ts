import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllergiesComponent } from './list-allergies.component';

describe('ListAllergiesComponent', () => {
  let component: ListAllergiesComponent;
  let fixture: ComponentFixture<ListAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllergiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
