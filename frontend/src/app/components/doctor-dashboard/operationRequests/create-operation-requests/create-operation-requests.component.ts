import { Component, OnInit, SimpleChanges } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { OperationRequestService } from '../../../../services/operation-request.service';

@Component({
  selector: 'create-operation-requests',
  standalone: true,
  imports: [DialogModule, ToastModule, RadioButtonModule, FormsModule, DropdownModule, CalendarModule],
  templateUrl: './create-operation-requests.component.html',
  styleUrls: ['./create-operation-requests.component.scss'],
  providers: [OperationRequestService]
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

  constructor(private operationRequestService: OperationRequestService) {}

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
        console.error('Todos os campos obrigatórios devem ser preenchidos!');
        return;
    }

    const operationRequest = {
      priorityLevel: this.priority,
      operationTypeId: this.operationTypeName ? this.operationTypeName.value : '',
      deadlineDate: this.deadlinedate ? this.deadlinedate.toISOString() : '',
      status: this.status || 'Scheduled',
      doctorId: this.selectedDoctorId?.value || '',
      patientMedicalRecordNumber: this.selectedPatient ? this.selectedPatient.value : 'DefaultPatientId' // Should be correctly bound
  };

    console.log('Payload:', operationRequest);

    this.operationRequestService.saveOperationRequest(operationRequest).subscribe(
        () => {
            console.log('Pedido registrado com sucesso!');
            this.resetForm();
            this.visible = false;
        },
        (error) => {
            console.error('Erro ao registrar pedido', error);
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
}