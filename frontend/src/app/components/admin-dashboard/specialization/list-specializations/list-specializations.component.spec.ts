import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpecializationsComponent } from './list-specializations.component';

describe('ListSpecializationsComponent', () => {
  let component: ListSpecializationsComponent;
  let fixture: ComponentFixture<ListSpecializationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSpecializationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
