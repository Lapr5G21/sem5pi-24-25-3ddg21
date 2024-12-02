import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecializationsComponent } from './create-specializations.component';

describe('CreateSpecializationsComponent', () => {
  let component: CreateSpecializationsComponent;
  let fixture: ComponentFixture<CreateSpecializationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpecializationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
