import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment.service';
import { StaffService } from '../../../../services/staff.service';
import { Appointment } from '../../../../domain/appointment-model';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UpdateAppointmentDto } from '../../../../domain/appointment-model';
import { MultiSelectModule } from 'primeng/multiselect';
import { DataViewModule } from 'primeng/dataview';
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'list-appointments',
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss'],
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ToastModule,
    TagModule,
    MultiSelectModule,
    DataViewModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ListAppointmentsComponent implements OnInit {
  appointments: any[] = []; // Lista de appointments
  loading: boolean = false; // Indicador de carregamento
  patient: any;
  editDialogVisible: boolean = false;
  selectedAppointment: any = { surgeryRoomDto: {} }; // Inicializando surgeryRoomDto
  teamOptions: { label: string; value: string }[] = []; // Lista de opções para TeamIds
  selectedTeamMembers: any[] = []; // Lista de membros selecionados
  doctors: Map<string, any> = new Map();

  constructor(
    private appointmentService: AppointmentService, 
    private staffService: StaffService, 
    private messageService: MessageService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadAppointments(); // Carregar os appointments ao inicializar o componente
  }

  validateSelectedTeamMembers(): void {
    const uniqueMembers = new Map();
    this.selectedTeamMembers.forEach(member => {
        if (!uniqueMembers.has(member.value)) {
            uniqueMembers.set(member.value, member);
        }
    });

    this.selectedTeamMembers = Array.from(uniqueMembers.values());
    console.log('Validated Team Members:', this.selectedTeamMembers);
}


  // Carrega os appointments
  loadAppointments(): void {
    console.log('loadAppointments called');
    this.loading = true;
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.appointments.forEach((appointment) => {
          if (appointment.operationRequestDto?.medicalRecordNumber) {
            this.patientService.getPatientById(appointment.operationRequestDto.medicalRecordNumber).subscribe(
              (patient) => {
                appointment.patientName = patient?.fullName || 'Desconhecido';
              },
              (error) => {
                console.error(`Error fetching patient ${appointment.operationRequestDto.patientId}:`, error);
                appointment.patientName = 'Erro ao carregar';
              }
            );
          } else {
            appointment.patientName = 'ID do paciente não disponível';
          }
        });
  
        this.loading = false;
      },
      (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    );
  }
  

  fetchPatient(id : string) {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
      },
      error: (error) => {
        this.patient = null;
      }
    });
  }

  // Método para carregar os staffs
  loadStaffs(): void {
    this.teamOptions = Array.from(this.doctors.entries()).map(([key, value]) => ({
      label: value,
      value: key,
    }));
    console.log('Team Options:', this.teamOptions);
  }

  // Carrega os médicos
  loadDoctors() {
    this.staffService.getStaffs().subscribe(
      (doctors) => {
        // Verifica se a resposta é um array
        if (Array.isArray(doctors)) {
          // Itera sobre cada médico e mapeia as informações no Map
          doctors.forEach(doctor => {
            if (doctor.staffId && doctor.staffFullName) {
              // Adiciona ao Map, usando o staffId como chave e staffFullName como valor
              this.doctors.set(doctor.staffId, doctor.staffFullName);
              console.log(`Médico adicionado: ${doctor.staffId} - ${doctor.staffFullName}`);
            } else {
              console.warn('Faltando staffId ou staffFullName para o médico:', doctor);
            }
          });
          // Após adicionar, você pode chamar a função para atualizar a lista de opções do team
          this.loadStaffs();
        } else {
          console.error('A resposta da API não é um array válido:', doctors);
        }
      },
      (error) => {
        console.error('Erro ao carregar médicos', error);
      }
    );
  }

  // Método para editar um appointment
  editAppointment(appointment: any): void {
    if (appointment) {
      console.log('Selected appointment for editing:', appointment);
      this.loadDoctors();
      console.log(this.doctors);
      console.table(Array.from(this.doctors.entries()));  // Exibe os dados de forma tabular
      this.loadStaffs();

      // Mapear membros da equipa para o formato correto
        this.selectedTeamMembers = appointment.team.map((member: any) => ({
          label: member.staffFullName,
          value: member.staffId,
      }));      
      this.selectedAppointment = { ...appointment }; // Passa o appointment selecionado
      console.log(this.selectedAppointment);
      this.editDialogVisible = true; // Exibe o diálogo
    } else {
      console.error('No appointment selected!');
    }
  }

  closeEditDialog() {
    this.editDialogVisible = false; // Fecha o diálogo
  }

  // Método para atualizar o appointment
  updateAppointment(selectedAppointment: any) {
    console.log('Saving appointment info:', selectedAppointment);

    // Converte a lista de membros selecionados para apenas os `staffId`
    const formattedTeamIds = this.selectedTeamMembers.map((member: any) => {
      console.log(member);
      return member.value; // Aqui estamos a assumir que a lista contém apenas `staffId`
    });

    console.log('Formatted Team Ids:', formattedTeamIds); // Exibe os IDs formatados

    this.appointmentService.updateAppointment(selectedAppointment, formattedTeamIds).subscribe({
      next: (response) => {
        console.log('Appointment info successfully updated:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment info successfully updated!',
        });
        this.editDialogVisible = false;
      },
      error: (error) => {
        console.error('Error updating appointment info:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update appointment information.',
        });
      },
      complete: () => {
        console.log('Appointment update process completed.');
        this.loadAppointments();
      }
    });
  }

  logData(data: any): void {
    console.log(data);
  }
}
