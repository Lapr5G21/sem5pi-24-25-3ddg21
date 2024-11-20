import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../services/patient.service';
import { HttpClientModule } from '@angular/common/http';
import { EditPatientDto } from '../../../../domain/patient-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'edit-patients-modal',
    templateUrl: './edit-patients.component.html',
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
        FormsModule,
        CommonModule,
        HttpClientModule,
        ToastModule,
        DataViewModule
    ],
    providers: [PatientService, MessageService]
})
export class EditPatientsComponent {

    @Input() patient: any = {} ; // Paciente passado pelo list-patients
    @Output() close = new EventEmitter<void>(); // Emite evento ao fechar o diálogo

    editDialogVisible: boolean = false;
    selectedPatient: any = {}; 

    FirstName: string = '';
    LastName: string = '';
    FullName: string = '';
    MedicalHistory : string = '';
    Email: string = '';
    PhoneNumber: string = '';
    Address: string = '';

    constructor(
        private patientService: PatientService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.editDialogVisible = true;
    }

    updatePatient(selectedPatient: any) {
        console.log('Saving patient info:', selectedPatient);
        
        this.patientService.updatePatient(selectedPatient.medicalRecordNumber, selectedPatient).subscribe({
          next: (response) => {
            console.log('Patient info successfully updated:', response);
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Patient info successfully updated!',
            });
            
            this.editDialogVisible = false; 
          },
          error: (error) => {
            console.error('Error updating patient info:', error);
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update patient information.',
            });
          },
          complete: () => {
            console.log('Patient update process completed.');
          }
        });
      }

    resetForm() {
        this.FirstName = '';
        this.LastName = '';
        this.FullName = '';
        this.MedicalHistory = '';
        this.Email = '';
        this.PhoneNumber = '';
        this.Address = '';

    }

    closeDialog(): void {
        this.close.emit(); // Notifica o componente pai
      }
}

