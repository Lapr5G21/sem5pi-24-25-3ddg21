import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms'; // Para usarmos ngModel
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { PatientService } from '../../../../services/patient.service';
import { StaffService } from '../../../../services/staff.service';
import { OperationTypeService } from '../../../../services/operation-type-service.service';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'list-operation-requests',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    ButtonModule,
    CommonModule,
    DataViewModule,
    TagModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ConfirmDialogModule,
    CalendarModule,
    DialogModule,
  ],
  templateUrl: './list-operation-requests.component.html',
  styleUrls: ['./list-operation-requests.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListOperationRequestsComponent implements OnInit {
  // Variáveis para armazenar os valores sem usar o FormGroup
  priority: string = '';
  status: string = '';
  deadlineDate: Date |null  = null;
  operationRequestId: string = '';

  operationRequests: any[] = [];
  filteredOperationRequests: any[] = [];
  patients: Map<string, any> = new Map();
  doctors: Map<string, any> = new Map();
  operationTypes: Map<string, string> = new Map();

  patientFilter: string = '';
  operationTypeFilter: string = '';
  priorityFilter: string = '';
  statusFilter: string = '';
  nameFilter: string = '';

  display: boolean = false;

  operationRequest = {
    priority: '',
    status: '',
    deadlineDate: null
  };

  priorityOptions = [
    { label: 'Elective', value: 'Elective' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Emergency', value: 'Emergency' }
  ];

  statusOptions = [
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'On Schedule', value: 'onSchedule' },
  ];

  constructor(
    private operationRequestService: OperationRequestService,
    private patientService: PatientService,
    private staffService: StaffService,
    private operationTypeService: OperationTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperationRequests();
  }

  loadOperationRequests() {
    this.operationRequestService.getOperationRequests().subscribe(
      (operationRequests) => {
        this.operationRequests = operationRequests;
        this.filteredOperationRequests = [...operationRequests]; // Inicializa com todos os dados

        this.loadPatients();
        this.loadDoctors();

        const operationTypeIds = operationRequests.map(req => req.operationTypeId);
        this.loadOperationTypes(operationTypeIds);
      },
      (error) => {
        console.error('Erro ao carregar solicitações de operação', error);
      }
    );
  }

  loadPatients() {
    this.patientService.getPatients().subscribe(
      (patients) => {
        patients.forEach(patient => {
          this.patients.set(patient.medicalRecordNumber, patient.fullName);
        });
      },
      (error) => {
        console.error('Erro ao carregar pacientes', error);
      }
    );
  }

  loadDoctors() {
    this.staffService.getStaffs().subscribe(
      (doctors) => {
        doctors.forEach(doctor => {
          this.doctors.set(doctor.staffId, doctor.staffFullName);
        });
      },
      (error) => {
        console.error('Erro ao carregar médicos', error);
      }
    );
  }

  loadOperationTypes(operationTypeIds: string[]) {
    this.operationTypeService.getOperationTypes().subscribe(
      (operationTypes) => {
        operationTypes.forEach(type => {
          this.operationTypes.set(type.id, type.name);
        });
      },
      (error) => {
        console.error('Erro ao carregar tipos de operação', error);
      }
    );
  }

  applyFilter() {
    let filteredRequests = this.operationRequests;

    if (this.nameFilter) {
      filteredRequests = filteredRequests.filter(req => {
        const patientName = this.getPatientName(req.pacientMedicalRecordNumber)?.toLowerCase();
        return patientName && patientName.includes(this.nameFilter.toLowerCase());
      });
    }

    if (this.operationTypeFilter) {
      filteredRequests = filteredRequests.filter(req =>
        this.getOperationTypeName(req.operationTypeId).toLowerCase().includes(this.operationTypeFilter.toLowerCase())
      );
    }

    if (this.priorityFilter) {
      filteredRequests = filteredRequests.filter(req =>
        req.priorityLevel === this.priorityFilter
      );
    }

    if (this.statusFilter) {
      filteredRequests = filteredRequests.filter(req =>
        req.status === this.statusFilter
      );
    }

    this.filteredOperationRequests = filteredRequests;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Emergency': return 'p-tag p-tag-danger';
      case 'Urgent': return 'p-tag p-tag-warning';
      case 'Elective': return 'p-tag p-tag-success';
      default: return 'p-tag p-tag-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled': return 'p-tag p-tag-success';
      case 'OnSchedule': return 'p-tag p-tag-danger';
      default: return 'p-tag p-tag-secondary';
    }
  }

  getDoctorName(doctorId: string): string {
    const doctorName = this.doctors.get(doctorId);
    return doctorName ? doctorName : 'Não especificado';
  }

  getPatientName(patientId: string): string {
    const patientName = this.patients.get(patientId);
    return patientName ? patientName : 'Não especificado';
  }

  getOperationTypeName(operationTypeId: string): string {
    return this.operationTypes.get(operationTypeId) || 'Não especificado';
  }

  removeOperationRequest(id: string) {
    this.operationRequestService.removeOperationRequest(id).subscribe(
      () => {
        this.operationRequests = this.operationRequests.filter(item => item.id !== id);
        this.filteredOperationRequests = this.filteredOperationRequests.filter(item => item.id !== id);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Operação removida com sucesso!'
        });
      },
      (error) => {
        console.error('Erro ao remover operação', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover a operação!'
        });
      }
    );
  }

  confirmDeactivateOperationRequest(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir esta operação permanentemente?',
      accept: () => {
        this.removeOperationRequest(id);
      }
    });
  }

  openDialog(item: any): void {
    // Preenche diretamente as variáveis com os dados da solicitação de operação selecionada
    this.priority = item.priorityLevel;
    this.status = item.status;
    this.deadlineDate = item.deadlineDate ? new Date(item.deadlineDate) : null;
    this.operationRequestId = item.id;

    this.display = true;
  }

  saveChanges(): void {
    const updatedRequest = {
      id: this.operationRequestId,
      priority: this.priority,
      status: this.status,
      deadlineDate: this.deadlineDate
    };

    this.operationRequestService.updateOperationRequest(updatedRequest).subscribe(
      (response) => {
        const index = this.operationRequests.findIndex(request => request.id === updatedRequest.id);
        if (index !== -1) {
          this.operationRequests[index] = updatedRequest;
          this.filteredOperationRequests = [...this.operationRequests];
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Operação atualizada com sucesso!',
        });

        this.display = false;
      },
      (error) => {
        console.error('Erro ao atualizar operação', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar a operação!',
        });
      }
    );
  }
}
