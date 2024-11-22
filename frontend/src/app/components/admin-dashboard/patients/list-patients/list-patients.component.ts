import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';  
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@Component({
    selector: 'list-patients',
    templateUrl: './list-patients.component.html',
    styleUrls: ['./list-patients.component.scss'],
    standalone: true,
    imports: [
        TableModule,
        DialogModule,
        DataViewModule,
        ButtonModule,
        CommonModule,
        BadgeModule,
        ScrollPanelModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        FloatLabelModule,
        CalendarModule,
        ToastModule,
        ConfirmDialogModule,
        PaginatorModule
    ],
    providers:[MessageService, ConfirmationService]
})
export class ListPatientsComponent implements OnInit {
    // Opções de status para o filtro
    statusOptions: { label: string, value: boolean}[] = [
        { label: 'Active', value: true },
        { label: 'Deactivated', value: false }
    ];

    patients: any[] = [];

    // Filtros
    nameFilter: string = '';
    birthDateFilter: string = '';
    genderFilter: string = '';
    emailFilter: string = '';
    phoneNumberFilter: string = '';
    mrnFilter: string = '';
    statusFilter: boolean = true;

    medicalHistoryDialogVisible: boolean = false;
    selectedMedicalHistory: string = '';

    editDialogVisible: boolean = false;
    selectedPatient: any = {}; //Paciente Selecionado

    medicalRecordDialogVisible: boolean = false; // Controle do diálogo de edição do registro médico


    constructor(private patientService: PatientService, private messageService : MessageService) {}

    ngOnInit(): void {
        this.loadPatients();
    }

    // Carrega os pacientes com base nos filtros aplicados
    loadPatients(): void {
        const statusBoolean = this.statusFilter;
        this.patientService
            .searchPatients(this.nameFilter, this.birthDateFilter, this.genderFilter, this.emailFilter, this.phoneNumberFilter, this.mrnFilter, statusBoolean)
            .subscribe(
                (patients) => {
                    console.log('Patients received:', patients);
                    this.patients = patients;
                },
                (error) => {
                    console.error('Error loading patients:', error);
                }
            );
    }

    // Mostra o histórico médico em um diálogo
    showMedicalHistory(medicalHistory: string): void {
        this.selectedMedicalHistory = medicalHistory;
        this.medicalHistoryDialogVisible = true;
    }

    // Método de busca acionado ao clicar no botão ou alterar filtros
    onSearch(): void {
        this.loadPatients();
    }

    openEditDialog(patient: any) {
        if (patient) {
          console.log('Selected patient for editing:', patient);
          this.selectedPatient = { ...patient }; // Passa o paciente selecionado
          this.editDialogVisible = true; // Exibe o diálogo
        } else {
          console.error('No patient selected!');
        }
      }
      

    closeEditDialog() {
        this.editDialogVisible = false; // Fecha o diálogo
    }

    updatePatient(selectedPatient: any) {
        console.log('Saving patient info:', selectedPatient);
        
        this.patientService.updatePatient(selectedPatient).subscribe({
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
            this.loadPatients();

          }
        });
      }

 // Abre o diálogo para editar o registro médico
openMedicalRecordDialog(): void {
  if (this.selectedPatient) {
    this.medicalRecordDialogVisible = true;
  } else {
    console.error('No patient selected for editing medical record!');
  }
}

// Fecha o diálogo de edição do registro médico
closeMedicalRecordDialog(): void {
  this.medicalRecordDialogVisible = false;
}

// Salva as alterações feitas no registro médico
saveMedicalRecord(): void {
  console.log('Saving updated medical record:', this.selectedPatient.medicalRecord);

  // Chamada para salvar as alterações no backend
  this.updatePatient(this.selectedPatient);
  this.medicalRecordDialogVisible = false;

}

adjustTextarea(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Redefine a altura para calcular o novo tamanho
  textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para o tamanho do conteúdo
}


  
}
