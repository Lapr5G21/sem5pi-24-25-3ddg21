import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateOperationTypesComponent } from './create-operation-types.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OperationTypeService } from '../../../../services/operation-type-service.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateOperationTypesComponent', () => {
  let component: CreateOperationTypesComponent;
  let fixture: ComponentFixture<CreateOperationTypesComponent>;
  let operationTypeServiceMock: jasmine.SpyObj<OperationTypeService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    operationTypeServiceMock = jasmine.createSpyObj('OperationTypeService', ['saveOperationType', 'getSpecializations']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        CreateOperationTypesComponent
      ],
      providers: [
        { provide: OperationTypeService, useValue: operationTypeServiceMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOperationTypesComponent);
    component = fixture.componentInstance;

    component.optionList = [
      { label: 'Cardiology', value: '1' },
      { label: 'Neurology', value: '2' }
    ];

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Dialog visibility test
  describe('Dialog visibility', () => {
    it('should display the dialog when visible is set to true', () => {
      component.visible = true;
      fixture.detectChanges();
      const dialogElement = fixture.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
    });
  });

  // Form validation tests
  describe('Form validation', () => {
    it('should mark the form as invalid when required fields are empty', () => {
      component.operationTypeName = '';
      component.estimatedDuration = null;
      fixture.detectChanges();
      expect(component.isFormValid()).toBeFalse();
    });

    it('should mark the form as valid when all required fields are filled', () => {
      component.operationTypeName = 'Test Operation';
      component.estimatedDuration = 120;
      component.anesthesiaTime = 30;
      component.surgeryTime = 60;
      component.cleaningTime = 15;
      component.selectedSpecializations = ['1'];
      fixture.detectChanges();
      expect(component.isFormValid()).toBeTrue();
    });
  });

  // Test save operation type when form is invalid
  it('should not call the service to save when the form is invalid', fakeAsync(() => {
    component.operationTypeName = '';
    component.saveOperationType();
    tick();
    expect(operationTypeServiceMock.saveOperationType).not.toHaveBeenCalled();
  }));

  describe('Add Specializations', () => {
    it('should add a specialization to the selected list', () => {
      component.selectedSpecializations = [];
      component.staffNumbers = {};
      component.selectedSpecializations.push('1');
      fixture.detectChanges();

      expect(component.selectedSpecializations).toContain('1');
    });
  });

  it('should not call saveOperationType if no specializations are selected', fakeAsync(() => {
    component.selectedSpecializations = [];
    component.saveOperationType();
    tick();
    expect(operationTypeServiceMock.saveOperationType).not.toHaveBeenCalled();
  }));
});
