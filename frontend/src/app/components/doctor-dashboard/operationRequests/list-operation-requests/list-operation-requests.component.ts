import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';  
import { FloatLabelModule } from 'primeng/floatlabel';

import { OperationRequestService } from '../../../../services/operation-request.service';
import { PatientService } from '../../../../services/patient.service';
import { StaffService } from '../../../../services/staff.service';
import { OperationTypeService } from '../../../../services/operation-type-service.service';

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
    FloatLabelModule,
  ],  
  templateUrl: './list-operation-requests.component.html',
  styleUrls: ['./list-operation-requests.component.scss'],
})
export class ListOperationRequestsComponent implements OnInit {
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOperationRequests();
  }
  
  loadOperationRequests() {
    this.operationRequestService.getOperationRequests().subscribe(
      (operationRequests) => {
        this.operationRequests = operationRequests;
        this.filteredOperationRequests = [...operationRequests]; // Inicializa com todos os dados
  
        // Carrega os pacientes e médicos após carregar as solicitações de operação
        this.loadPatients();
        this.loadDoctors();
        
        // Carrega os tipos de operação
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
        console.log('Pacientes carregados:', patients); // Debugging
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
        console.log('Médicos carregados:', doctors); // Debugging
        doctors.forEach(doctor => {
          this.doctors.set(doctor.staffId, doctor.staffFullName); // Usa staffId como chave e staffFullName como valor
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
          this.operationTypes.set(type.id, type.name); // Assuming type.id is the ID and type.name is the name
        });
      },
      (error) => {
        console.error('Erro ao carregar tipos de operação', error);
      }
    );
  }

  applyFilter() {
    let filteredRequests = this.operationRequests;
  
    // Filtra pelo nome do paciente
    if (this.nameFilter) {
      filteredRequests = filteredRequests.filter(req =>
        req.pacientMedicalRecordNumber?.toLowerCase().includes(this.nameFilter.toLowerCase())
      );
    }
  
    // Filtra pelo nome do tipo de operação
    if (this.operationTypeFilter) {
      filteredRequests = filteredRequests.filter(req =>
        this.getOperationTypeName(req.operationTypeId).toLowerCase().includes(this.operationTypeFilter.toLowerCase())
      );
    }
  
    // Filtra pela prioridade
    if (this.priorityFilter) {
      filteredRequests = filteredRequests.filter(req =>
        req.priorityLevel === this.priorityFilter
      );
    }
  
    // Filtra pelo status
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
    const doctorName = this.doctors.get(doctorId); // Verifica com a chave staffId
    return doctorName ? doctorName : 'Não especificado';
  }
  
  
  getPatientName(patientId: string): string {
    const patientName = this.patients.get(patientId); // Aqui usamos paciente pelo `medicalRecordNumber`
    return patientName ? patientName : 'Não especificado'; 
  }

  getOperationTypeName(operationTypeId: string): string {
    return this.operationTypes.get(operationTypeId) || 'Não especificado';
  }

  confirmDeactivateOperationRequest(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja desativar esta operação?',
      accept: () => {
        this.removeOperationRequest(id);
      },
    });
  }

  removeOperationRequest(id: string) {
    this.operationRequestService.removeOperationRequest(id).subscribe(
      () => {
        const request = this.operationRequests.find((item) => item.id === id);
        if (request) {
          request.status = 'DESATIVADO';
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Operação desativada com sucesso!',
        });
      },
      (error) => {
        console.error('Erro ao desativar operação', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao desativar a operação!',
        });
      }
    );
  }
}
