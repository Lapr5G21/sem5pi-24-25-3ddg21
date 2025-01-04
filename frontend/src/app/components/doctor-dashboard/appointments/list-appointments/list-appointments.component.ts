import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment.service';
import { Appointment } from '../../../../domain/appointment-model'; // Atualize o caminho
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';

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
        TagModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class ListAppointmentsComponent implements OnInit {
    appointments: any[] = []; // Lista de appointments
    loading: boolean = false; // Indicador de carregamento

    constructor(private appointmentService: AppointmentService,
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

    // Método para editar um appointment
    editAppointment(appointment: Appointment): void {
        console.log('Editing appointment:', appointment);
        // Implementar lógica de edição aqui
    }

    logData(data: any): void {
      console.log(data);
  }
}
