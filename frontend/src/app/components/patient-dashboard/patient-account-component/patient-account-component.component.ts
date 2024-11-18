import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../domain/patient-model';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../../../services/user-service.service';
import { DialogModule } from 'primeng/dialog';
import { PanelMenu } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';  // Add this import
import { SpinnerModule } from 'primeng/spinner';

@Component({
  selector: 'app-patient-account',
  imports:[PanelModule,CommonModule,ConfirmDialogModule,FormsModule,SpinnerModule],
  standalone : true,
  templateUrl: './patient-account-component.component.html',
  styleUrls: ['./patient-account-component.component.scss'],
  providers: [ConfirmationService]  // Adicionar o serviço de confirmação
})
export class PatientAccountComponent implements OnInit {
  patient: Patient | null = null;
  error: string = '';
  isLoading: boolean = true;
  isEditing: boolean = false;  // Flag para saber se estamos no modo de edição
  displayConfirmDialog: boolean = false;  // Para controle do modal de confirmação de exclusão

  constructor(private patientService: PatientService, private confirmationService: ConfirmationService,private userService : UserService) {}

  ngOnInit(): void {
    this.fetchPatientData();
    
    
  }

  fetchPatientData(): void {
    this.isLoading = true;
    const email = localStorage.getItem('email');
    
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe(
        (data) => {
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
          this.error = '';  // Limpar qualquer erro
          console.log('Changes saved successfully');
        },
        (err) => {
          this.error = 'Erro ao salvar alterações';
          console.error('Error saving patient:', err);
        }
      );
    }
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir sua conta?',
      header: 'Confirmação de Excluir',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAccount();
      },
      reject: () => {
        console.log('Account deletion canceled');
      }
    });
  }

  deleteAccount(): void {
    if (this.patient) {
      this.userService.deletePatient(this.patient.MedicalRecordNumber).subscribe(
        () => {
          console.log('Account deleted');
        },
        (err) => {
          this.error = 'Erro ao excluir a conta';
          console.error('Error deleting patient account:', err);
        }
      );
    }
  }
  onConfirmDialogVisibleChange(event: any): void {
    this.displayConfirmDialog = event.visible;
  }
}
