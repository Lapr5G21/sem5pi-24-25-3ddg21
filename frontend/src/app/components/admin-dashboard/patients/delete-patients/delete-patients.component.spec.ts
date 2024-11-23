import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatientsComponent } from './delete-patients.component';
import { HttpClientModule } from '@angular/common/http';

describe('DeletePatientsComponent', () => {
  let component: DeletePatientsComponent;
  let fixture: ComponentFixture<DeletePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
