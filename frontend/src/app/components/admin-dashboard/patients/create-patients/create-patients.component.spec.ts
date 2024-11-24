import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreatePatientsComponent } from './create-patients.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../../services/patient.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('CreatePatientsComponent', () => {
  let component: CreatePatientsComponent;
  let fixture: ComponentFixture<CreatePatientsComponent>;
  let patientServiceMock: jasmine.SpyObj<PatientService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    patientServiceMock = jasmine.createSpyObj('PatientService', ['savePatient']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    patientServiceMock.savePatient.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        CreatePatientsComponent
      ],
      providers: [
        { provide: PatientService, useValue: patientServiceMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePatientsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Dialog visibility', () => {
    it('should display the dialog when visible is set to true', () => {
      component.visible = true;
      fixture.detectChanges();
      const dialogElement = fixture.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
    });
  });

  describe('Form validation', () => {
    it('should mark the form as invalid when required fields are empty', () => {
      component.FirstName = '';
      component.LastName = '';
      component.FullName = '';
      component.BirthDate = '';
      component.Gender = '';
      component.Email = '';
      component.PhoneNumber = '';
      component.Address = '';
      component.EmergencyContact = '';
      fixture.detectChanges();
      component.validateFields();
      expect(component.isFirstNameValid).toBeFalse();
      expect(component.isLastNameValid).toBeFalse();
      expect(component.isFullNameValid).toBeFalse();
      expect(component.isBirthDateValid).toBeFalse();
      expect(component.isGenderValid).toBeFalse();
      expect(component.isEmailValid).toBeFalse();
      expect(component.isPhoneNumberValid).toBeFalse();
      expect(component.isAddressValid).toBeFalse();
      expect(component.isEmergencyContactValid).toBeFalse();
    });

    it('should mark the form as valid when all required fields are filled', () => {
      component.FirstName = 'John';
      component.LastName = 'Doe';
      component.FullName = 'John Doe';
      component.BirthDate = '2004-06-27';
      component.Gender = 'Male';
      component.Email = 'john.doe@example.com';
      component.PhoneNumber = '912345678';
      component.Address = '123 Main St, Lisbon, Portugal';
      component.EmergencyContact = '923456789';
      fixture.detectChanges();
      component.validateFields();
      expect(component.isFirstNameValid).toBeTrue();
      expect(component.isLastNameValid).toBeTrue();
      expect(component.isFullNameValid).toBeTrue();
      expect(component.isBirthDateValid).toBeTrue();
      expect(component.isGenderValid).toBeTrue();
      expect(component.isEmailValid).toBeTrue();
      expect(component.isPhoneNumberValid).toBeTrue();
      expect(component.isAddressValid).toBeTrue();
      expect(component.isEmergencyContactValid).toBeTrue();
    });
  });

  it('should not call the service to save when the form is invalid', fakeAsync(() => {
    component.FirstName = '';
    component.savePatient();
    tick();
    expect(patientServiceMock.savePatient).not.toHaveBeenCalled();
  }));

  /*it('should call the service to save when the form is valid', fakeAsync(() => {
    component.FirstName = 'John';
    component.LastName = 'Doe';
    component.FullName = 'John Doe';
    component.BirthDate = '2004-06-27';
    component.Gender = 'Male';
    component.Email = 'john.doe@example.com';
    component.PhoneNumber = '912345678';
    component.Address = '123 Main St, Lisbon, Portugal';
    component.EmergencyContact = '923456789';
    fixture.detectChanges();
    component.savePatient();
    tick();
    expect(patientServiceMock.savePatient).toHaveBeenCalled();
  }));

  it('should show a success message when the patient is saved successfully', async () => {
    component.FirstName = 'John';
    component.LastName = 'Doe';
    component.FullName = 'John Doe';
    component.BirthDate = '2004-06-27';
    component.Gender = 'Male';
    component.Email = 'john.doe@example.com';
    component.PhoneNumber = '912345678';
    component.Address = '123 Main St, Lisbon, Portugal';
    component.EmergencyContact = '923456789';
  
    fixture.detectChanges();
  
    // Chama o método para salvar o paciente
    await component.savePatient();
  
    // Valida que o serviço foi chamado
    expect(patientServiceMock.savePatient).toHaveBeenCalled();
  
    // Valida que a mensagem de sucesso foi exibida
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success', summary: 'Success', detail: 'Patient Successfully Saved!' })
    );
  });*/
  
});
