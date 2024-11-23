import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'create-operation-requests',
  standalone: true,
  imports: [DialogModule, ToastModule, RadioButtonModule, FormsModule, DropdownModule, CalendarModule,CommonModule],
  templateUrl: './create-operation-requests.component.html',
  styleUrls: ['./create-operation-requests.component.scss'],
  providers: [OperationRequestService,MessageService]
})
export class CreateOperationRequestsComponent implements OnInit {
  visible: boolean = false;
  priority: string = '';
  operationTypeName: { label: string; value: string } | null = null;
  operationType: { label: string; value: string }[] = [];
  deadlinedate: Date | null = null;
  status: string = '';
  selectedDoctor: { label: string; value: string }[] = [];
  selectedDoctorId: { label: string; value: string } | null = null;
  patient: { label: string; value: string }[] = [];
  selectedPatient: { label: string; value: string } | null = null;

  constructor(private operationRequestService: OperationRequestService,private messageService: MessageService) {}

  loadOperationTypes() {
    this.operationRequestService.getOperationTypes().subscribe(
      (operationTypes) => {
        this.operationType = operationTypes.map(spec => ({
          label: spec.name,
          value: spec.id
        }));
      },
      (error) => console.error('Erro ao carregar Tipos de Operações', error)
    );
  }

  loadDoctors() {
    this.operationRequestService.getDoctors().subscribe(
        (doctors) => {
            this.selectedDoctor = doctors.map(doc => ({
                label: doc.staffFullName,
                value: doc.staffId // Ensure 'doc.id' is the correct identifier
            }));
            console.log(this.selectedDoctor); // Log to check the content of selectedDoctor
        },
        (error) => console.error('Erro ao carregar Doutores', error)
    );
}

onDoctorChange() {
  console.log('Selected Doctor:', this.selectedDoctorId);
}

loadPacients() {
  this.operationRequestService.getPatients().subscribe(
    (patients) => {
      this.patient = patients.map(patient => ({
        label: patient.fullName,
        value: patient.medicalRecordNumber  
      }));
    },
    (error) => console.error('Erro ao carregar Pacientes', error)
  );
}

  ngOnInit() {
    this.loadDoctors();
    this.loadOperationTypes();
    this.loadPacients();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.visible) {
      this.resetForm();
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  saveOperationRequest() {
    console.log('selectedDoctorId:', this.selectedDoctorId); // Verifique se o doctorId está correto

    if (!this.priority || !this.operationTypeName || !this.selectedPatient || !this.selectedDoctorId?.value || !this.deadlinedate) {
      this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'All required fields must be filled!'
      });
      console.error('Todos os campos obrigatórios devem ser preenchidos!');
      return;
  }

  const operationRequest = {
      priority: this.priority,
      operationTypeId: this.operationTypeName ? this.operationTypeName.value : '',
      deadlineDate: this.deadlinedate ? this.deadlinedate.toISOString() : '',
      status: this.status || 'Scheduled',
      doctorId: this.selectedDoctorId?.value || '',
      patientId: this.selectedPatient ? this.selectedPatient.value : 'DefaultPatientId'
  };

  console.log('Payload:', operationRequest);

  this.operationRequestService.saveOperationRequest(operationRequest).subscribe(
      () => {
          this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Operation Request Successfully Saved!'
          });
          console.log('Pedido registrado com sucesso!');
          this.resetForm();
          this.visible = false;
      },
      (error) => {
          console.error('Erro ao registrar pedido', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The operation request could not be saved!'
          });
      }
  );
}

resetForm() {
  this.priority = '';
  this.operationTypeName = null;
  this.deadlinedate = null;
  this.status = '';
  this.selectedDoctorId = null;
  this.selectedPatient = null; // Reset selectedPatient
}
isFormValid(): boolean {
  return !!(
    this.selectedPatient &&
    this.selectedDoctorId &&
    this.operationTypeName &&
    this.priority &&
    this.deadlinedate
  );
}
}