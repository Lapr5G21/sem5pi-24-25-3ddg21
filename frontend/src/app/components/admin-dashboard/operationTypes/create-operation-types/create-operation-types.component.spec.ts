import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOperationTypesComponent } from './create-operation-types.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { AuthModule } from '@auth0/auth0-angular';

describe('CreateOperationTypesComponent', () => {
  let component: CreateOperationTypesComponent;
  let fixture: ComponentFixture<CreateOperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        DropdownModule,  
        CreateOperationTypesComponent 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
