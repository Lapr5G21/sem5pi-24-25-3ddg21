import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Patient } from '../../../../domain/patient-model';
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'app-delete-patients',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './delete-patients.component.html',
  styleUrl: './delete-patients.component.scss'
})
export class DeletePatientsComponent {

  @Output() patientDeleted = new EventEmitter<Patient>();
  @Input() patient: any = {};

  constructor(private patientService: PatientService, private messageService: MessageService, private confirmationService: ConfirmationService){
  }


// Método para abrir o dialog de confirmação
confirmDelete(){
  this.confirmationService.confirm({
    message: `Are you sure you want to delete <br> <strong>${this.patient.fullName}</strong>?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'p-button-danger center-label', // Botão Confirmar Vermelho
    rejectButtonStyleClass: 'p-button-secondary center-label', // Botão Cancelar
    accept: () => {
      this.deletePatient(this.patient);
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Deletion cancelled',
      });
    },
  });
}

deletePatient(patient: Patient): void {
  this.patientService.delete(patient.medicalRecordNumber).subscribe(
    (response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${patient.fullName} has been deleted.`,
      });
      this.patientDeleted.emit(response);
    },
    (error) => {
      console.error("Error deleting patient:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete patient.',
      });
    }
  );
}
}

