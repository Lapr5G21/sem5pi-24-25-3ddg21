import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms'; 
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { PatientService } from '../../../../services/patient.service';
import { StaffService } from '../../../../services/staff.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { OperationTypeService } from '../../../../services/operation-type-service.service';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { CreatingAppointmentDto, Appointment } from '../../../../domain/appointment-model';
import { MultiSelectModule } from 'primeng/multiselect';


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
    ToastModule,
    MultiSelectModule
  ],
  templateUrl: './list-operation-requests.component.html',
  styleUrls: ['./list-operation-requests.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListOperationRequestsComponent implements OnInit {
  
  operationRequestId: string = '';
  priority: string = '';
  operationTypeId: string = '';
  deadlineDate: Date |null  = null;
  status: string = '';
  doctorId:  string = '';
  patientMedicalRecordNumber: string = '';

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
    operationTypeId: '',
    deadlineDate: null,
    status: '',
    doctorId: '',
    patientMedicalRecordNumber: ''
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

  appointmentDialog: boolean = false;

  SurgeryRoomId: string = '';
  OperationRequestId: string = ''; // Variável para armazenar o ID do request selecionado
  Date: string = '';
  TeamIds: { label: string, value: string }[] = [];
  AuxiliarDate: Date | null = null;

  isSurgeryRoomIdValid: boolean = true;
  isAuxiliarDateValid: boolean = true;
  isTeamIdsValid: boolean = true;

  isSubmitted: boolean = false;
  
  staffOptions: { label: string, value: string }[] = [];
  
  appointmentStatusMap: Map<String, boolean> = new Map();


  constructor(
    private operationRequestService: OperationRequestService,
    private patientService: PatientService,
    private staffService: StaffService,
    private operationTypeService: OperationTypeService,
    private appointmentService: AppointmentService,
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
        this.filteredOperationRequests = [...operationRequests]; 
        this.loadPatients();
        this.loadDoctors();

        const operationTypeIds = operationRequests.map(req => req.operationTypeId);
        this.loadOperationTypes(operationTypeIds);
        console.log("Operation Requests Filtered", this.filteredOperationRequests);
        console.log("Operation Requests", this.operationRequests);
        if (operationRequests.length > 0) {
          const firstRequest = operationRequests[0];
          console.log("Primeiro Request:", firstRequest);
          console.log("Tipo do ID (id):", typeof firstRequest.id);
        }


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
    this.operationRequestId = item.id;
    this.priority = item.priorityLevel;
    this.operationTypeId = item.operationTypeId;
    this.deadlineDate = item.deadlineDate ? new Date(item.deadlineDate) : null;
    this.status = item.status;
    this.doctorId = item.doctorId;
    this.patientMedicalRecordNumber = item.patientMedicalRecordNumber;
    
    console.log("Payload")
    console.log("ID do Op Request:", this.operationRequestId);
    console.log("Prioridade:", this.priority);
    console.log("ID do tipo de Operação:", this.operationTypeId);
    console.log("Data de prazo:", this.deadlineDate);
    console.log("Status:", this.status);
    console.log("ID do médico:", this.doctorId);
    console.log("Número do paciente:", this.patientMedicalRecordNumber);


    this.display = true;
  }

  saveChanges(): void {
    // Encontrar a operação original na lista (caso precise manter outros campos)
    const originalRequest = this.operationRequests.find(req => req.id === this.operationRequestId);
  
    if (!originalRequest) {
      console.error('Original operation request not found');
      return;
    }

    console.log(originalRequest);
  
    // Criar o objeto atualizado
    const updatedRequest = {
      id: this.operationRequestId, 
      operationTypeId : originalRequest.operationTypeId,
      priorityLevel: this.operationRequest.priority,
      status: this.operationRequest.status, // Propriedade ajustada para "Status"
      deadlineDate: this.operationRequest.deadlineDate,
      doctorId: originalRequest.doctorId, // "DoctorId"
      pacientMedicalRecordNumber: originalRequest.pacientMedicalRecordNumber, // Propriedade corrigida
    };
  
    console.log('Payload for save:', updatedRequest);
  
    // Chamar o serviço para atualizar
    this.operationRequestService.updateOperationRequest(updatedRequest.id, updatedRequest).subscribe({
      next: (response) => {
        console.log('Operation request updated successfully:', response);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Operation request updated successfully!',
        });
  
        this.display = false; // Fechar o diálogo
      },
      error: (error) => {
        console.error('Error updating operation request:', error);
        console.log('Full error details:', JSON.stringify(error));

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update operation request.',
        });
      },
      complete: () => {
        console.log('Operation request update process completed.');
        this.loadOperationRequests();
      }
    });
  }

//CREATING APPOINTMENT

  // Função chamada ao abrir o diálogo de agendamento
  openAppointmentDialog(requestId: string) {
    this.loadStaffs(); // Carrega as opções de staff
    this.OperationRequestId = requestId; // Armazena o ID do request
    this.appointmentDialog = true; // Abre o diálogo de agendamento
  }

    // Função para formatar a data para o formato ISO 8601
    formatDateToISO(date: Date): string {
      return date.toISOString(); // Converte a data para o formato ISO 8601
    }
  
    // Atualiza a data formatada quando o valor da data muda
    onDateChange() {
      if (this.AuxiliarDate) {
        const isoDate = this.formatDateToISO(this.AuxiliarDate);
        console.log('ISO Date:', isoDate);
        this.Date = isoDate; // Armazenar a data formatada como string
      }
    }


    isAppointmentCreated(): boolean {
      if (this.OperationRequestId === null) {
        return false;
      }
      return this.appointmentStatusMap.get(this.OperationRequestId) || false;
    }

    saveAppointment() {
      this.isSubmitted = true;
      this.validateFields();
    
      // Verificar se todos os campos são válidos
      if (this.isSurgeryRoomIdValid && this.isAuxiliarDateValid && this.isTeamIdsValid !== null) {
        // Formatar a data no formato ISO 8601
        const formattedDate = this.AuxiliarDate
          ? new Date(this.AuxiliarDate).toISOString().slice(0, 19)  // Remover o sufixo 'Z'
          : '';
    
        // Transformar os TeamIds (labels/values) em um array de strings com os staffIds
        const teamIdValues: string[] = this.TeamIds.map((team: any) => team.value);
    
        console.log('Surgery Room ID:', this.SurgeryRoomId);
        console.log('Formatted Date:', formattedDate);
        console.log('Team IDs:', teamIdValues);
    
        // Criar o DTO de nova consulta
        const appointment = new CreatingAppointmentDto(
          this.SurgeryRoomId,           // ID da sala de cirurgia
          this.OperationRequestId,      // ID do pedido de operação
          formattedDate,                // Data auxiliar no formato ISO
          teamIdValues                  // IDs da equipe
        );
    
        // Chamar o serviço para salvar a consulta
        this.appointmentService.saveAppointment(appointment).subscribe({
          next: (response) => {
            console.log('Appointment created successfully:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Appointment created successfully!',
            });
    
            this.appointmentDialog = false; // Fechar o diálogo
            this.loadOperationRequests();  // Recarregar os pedidos de operação
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create appointment.',
            });
          }
        });
      }
    }    
    


        validateFields() {
          this.isSurgeryRoomIdValid = !!this.SurgeryRoomId;
          this.isAuxiliarDateValid = !!this.AuxiliarDate;
          this.isTeamIdsValid = this.TeamIds.length > 0;
        }
      
        // Resetar o formulário
        resetForm() {
          this.SurgeryRoomId = '';
          this.AuxiliarDate = null;
          this.Date = '';
          this.TeamIds = [];
          this.OperationRequestId = '';
          this.isSurgeryRoomIdValid = true;
          this.isAuxiliarDateValid = true;
          this.isTeamIdsValid = true;
          this.isSubmitted = false;
        }

        cancelDialog(): void {
          this.resetForm();  // Chama o método para limpar os campos
          this.appointmentDialog = false;  // Fecha o diálogo
        }

          // Método para carregar os staffs
  loadStaffs(): void {
    this.staffOptions = Array.from(this.doctors.entries()).map(([key, value]) => ({
      label: value,
      value: key,
    }));
    console.log('Staff Options:', this.staffOptions);
  }
}  