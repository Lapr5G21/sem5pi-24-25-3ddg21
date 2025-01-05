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

    editDialogVisible: boolean = false;
    selectedAppointment: any = {}; //Appointment Selecionado
    teamOptions: { label: string; value: string }[] = []; // Lista de opções para TeamIds
    doctors: Map<string, any> = new Map();



    constructor(private appointmentService: AppointmentService, private staffService : StaffService, private messageService : MessageService
    ) {}

    ngOnInit(): void {
      console.log('ngOnInit called');
        this.loadAppointments(); // Carregar os appointments ao inicializar o componente
    }

    // Carrega os appointments
    loadAppointments(): void {
      console.log('loadAppointments called');
        this.loading = true;
        this.appointmentService.getAppointments().subscribe(
            (appointments) => {
                this.appointments = appointments;
                this.loading = false;
            },
            (error) => {
                console.error('Error loading appointments:', error);
                this.loading = false;
            }
        );
    }

              // Método para carregar os staffs
  loadStaffs(): void {
    this.teamOptions = Array.from(this.doctors.entries()).map(([key, value]) => ({
      label: value,
      value: key,
    }));
    console.log('Team Options:', this.teamOptions);
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

    // Método para editar um appointment
    editAppointment(appointment: any): void {
        if (appointment) {
            console.log('Selected appointment for editing:', appointment);
            this.loadDoctors();
            this.loadStaffs();
            this.selectedAppointment = { ...appointment }; // Passa o appointment selecionado
            this.editDialogVisible = true; // Exibe o diálogo
          } else {
            console.error('No appointment selected!');
          }
        }
        
  
      closeEditDialog() {
          this.editDialogVisible = false; // Fecha o diálogo
      }


      updateAppointment(selectedAppointment: any) {
        console.log('Saving appointment info:', selectedAppointment);
    
            // Converte a lista de objetos `team` para apenas os `staffId`
            const formattedTeamIds = selectedAppointment.team.map((member: any) => {
                if (member.userId) {
                    return member.userId.replace('@healthcare.com', '');
                }
                console.warn('Missing userId for team member:', member);
                return null; // ou você pode lançar um erro ou tratar como preferir
            });       
        
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
