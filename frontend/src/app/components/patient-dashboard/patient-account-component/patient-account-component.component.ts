import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../domain/patient-model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user-service.service';
import { DialogModule } from 'primeng/dialog';
import { PanelMenu } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';  // Add this import
import { SpinnerModule } from 'primeng/spinner';
import { ToastModule } from 'primeng/toast';
import { ProfileMenuComponent } from '../../admin-dashboard/profile-menu-component/profile-menu-component.component';

@Component({
  selector: 'app-patient-account',
  imports:[PanelModule,CommonModule,ConfirmDialogModule,FormsModule,SpinnerModule,ToastModule,ProfileMenuComponent],
  standalone : true,
  templateUrl: './patient-account-component.component.html',
  styleUrls: ['./patient-account-component.component.scss'],
  providers: [ConfirmationService,MessageService]  // Adicionar o serviço de confirmação
})
export class PatientAccountComponent implements OnInit {
  patient: Patient | null = null;
  error: string = '';
  isLoading: boolean = true;
  isEditing: boolean = false;  
  displayConfirmDialog: boolean = false;  

  constructor(private patientService: PatientService, private confirmationService: ConfirmationService,private userService : UserService,private messageService : MessageService) {}

  ngOnInit(): void {
    this.fetchPatientData();
    
    
  }

  fetchPatientData(): void {
    this.isLoading = true;
    const email = localStorage.getItem('email');
    
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe(
        (data) => {
          console.log('Fetched patient:', data); 
          this.patient = data;
          this.error = '';
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.error = 'Paciente não encontrado';
          this.patient = null;
        }
      );
    } else {
      this.isLoading = false;
      this.error = 'Email não encontrado no armazenamento local';
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.patient) {
      this.patientService.updatePatient(this.patient).subscribe(
        () => {
          this.isEditing = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated your information successfully!' }); // Toast para sucesso
        },
        (err) => {
          this.error = 'Error saving information';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error }); // Toast para erro
        }
      );
    }
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: 'You want to confirm the delete of your account?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAccount();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Canceled', detail: 'Delete account canceled' }); 
      }
    });
  }

  deleteAccount(): void {
    if (this.patient) {
      this.userService.deletePatient(this.patient.email).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email send to confirm the deletion of the account!' }); // Toast para sucesso
          setTimeout(() => {
            window.location.reload();
          }, 500);           
        this.userService.logout();
        },
        (err) => {
          this.error = 'Error deleting account';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
        }
      );
    }
  }

  onConfirmDialogVisibleChange(event: any): void {
    this.displayConfirmDialog = event.visible;
  }
}