import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateOperationRequestsComponent } from './create-operation-requests.component';
import { MessageService } from 'primeng/api';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

describe('CreateOperationRequestsComponent', () => {
  let component: CreateOperationRequestsComponent;
  let fixture: ComponentFixture<CreateOperationRequestsComponent>;
  let mockOperationRequestServiceMock: jasmine.SpyObj<OperationRequestService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    // Criando os mocks corretamente
    mockOperationRequestServiceMock = jasmine.createSpyObj('OperationRequestService', ['getDoctors', 'getPatients', 'getOperationTypes', 'saveOperationRequest']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    // Simulando os dados retornados pelos serviços
    mockOperationRequestServiceMock.getDoctors.and.returnValue(of([
      { staffFullName: 'Dr. John Doe', staffId: 'doc1' },
      { staffFullName: 'Dr. Jane Smith', staffId: 'doc2' }
    ]));
    mockOperationRequestServiceMock.getPatients.and.returnValue(of([
      { fullName: 'Patient One', medicalRecordNumber: 'p1' },
      { fullName: 'Patient Two', medicalRecordNumber: 'p2' }
    ]));
    mockOperationRequestServiceMock.getOperationTypes.and.returnValue(of([
      { name: 'Operation Type 1', id: 'op1' },
      { name: 'Operation Type 2', id: 'op2' }
    ]));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ToastModule], // Corrigido: incluir FormsModule e ToastModule
      declarations: [], 
      providers: [
        { provide: OperationRequestService, useValue: mockOperationRequestServiceMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form when resetForm is called', () => {
    component.selectedDoctorId = { label: 'Dr. John', value: 'doc1' };
    component.selectedPatient = { label: 'Patient 1', value: 'p1' };
    component.priority = 'High';
    component.operationTypeName = { label: 'Surgery', value: 'op1' };
    component.deadlinedate = new Date('2024-12-01');

    component.resetForm();

    expect(component.selectedDoctorId).toBeNull();
    expect(component.selectedPatient).toBeNull();
    expect(component.priority).toBe('');
    expect(component.operationTypeName).toBeNull();
    expect(component.deadlinedate).toBeNull();
  });

  describe('Dialog visibility', () => {
    it('should show the dialog when visible is set to true', () => {
      component.visible = true;
      fixture.detectChanges();
      const dialogElement = fixture.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
    });

    it('should hide the dialog when visible is set to false', () => {
      component.visible = false;
      fixture.detectChanges();
  
      const dialogElement = fixture.nativeElement.querySelector('p-dialog');
      expect(dialogElement.getAttribute('ng-reflect-visible')).toBe('false');
    });
  });
});
