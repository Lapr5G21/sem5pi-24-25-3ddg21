import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../domain/appointment-model';
import { AppointmentService } from '../../../services/appointment.service';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import { DatePipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CardModule, OverlayPanelModule, CommonModule,BadgeModule],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.scss',
  providers: [DatePipe],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patientId: string = "";
  datePipe: DatePipe = new DatePipe('en-US'); 

  constructor(private appointmentService: AppointmentService, private patientService: PatientService) {}

  ngOnInit(): void {
    this.getPatient();
  }

  getPatient() {
    const email = localStorage.getItem('email');
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe(
        (patientData) => {
          console.log('Paciente encontrado:', patientData);
          this.patientId = patientData.medicalRecordNumber;
          this.loadAppointments(this.patientId);
        },
        (error) => {
          console.error('Erro ao obter dados do paciente:', error);
        }
      );
    } else {
      console.error('Email não encontrado no localStorage');
    }
  }

  loadAppointments(patientId: string) {
    this.appointmentService.getAppointmentsByPatient(patientId).subscribe(
      (data: Appointment[]) => {
        console.log('Agendamentos recebidos:', data); // Verificar se os agendamentos estão sendo recebidos
        this.appointments = data.map(appointment => ({
          ...appointment,
          status: this.calculateStatus(appointment.operationRequestDto.deadline)
        }));
      },
      (error) => {
        console.error('Erro ao carregar os agendamentos', error);
      }
    );
  }

  calculateStatus(deadline: string): string {
    const currentDate = new Date();
    const operationDate = new Date(deadline);
    
    // Status de agendamento baseado na data de operação
    if (operationDate < currentDate) {
      return 'Done'; // Já passou
    } else if (operationDate > currentDate) {
      return 'Upcoming'; // No futuro
    } else {
      return 'Ongoing'; // No presente
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Done':
        return 'appointment-done'; // Classe para "Done"
      case 'Ongoing':
        return 'appointment-ongoing'; // Classe para "Ongoing"
      case 'Upcoming':
        return 'appointment-upcoming'; // Classe para "Upcoming"
      default:
        return '';
    }
  }

  formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    } else if (date instanceof Date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    }
    return '';
  }

  getBadgeSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined {
    switch (status) {
      case 'Upcoming':
        return 'success';  // Cor verde para operações futuras
      case 'Ongoing':
        return 'warning';  // Cor amarela para operações em andamento
      case 'Done':
        return 'success';  // Cor verde para operações concluídas
      default:
        return 'info';  // Cor padrão para status desconhecido
    }
  }  
  
}
