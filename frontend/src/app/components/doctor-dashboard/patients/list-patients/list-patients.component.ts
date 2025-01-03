import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient.service';
import { MedicalRecordService } from '../../../../services/medical-record-service';
import { AllergyService } from '../../../../services/allergy.service';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
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
import { MedicalRecord } from '../../../../domain/medical-record-model';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';

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
        PaginatorModule,
        MultiSelectModule
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
    allergyNameFilter: string = '';
    allergyCodeFilter: string = '';
    medicalConditionNameFilter: string = '';
    medicalConditionCodeFilter: string = '';

    medicalHistoryDialogVisible: boolean = false;
    selectedMedicalHistory: string = '';

    editDialogVisible: boolean = false;
    selectedPatient: any = {};

    medicalRecordDialogVisible: boolean = false; 
    medicalRecord: any = {};
    notationsDialogVisible: boolean = false;
    selectedNotations = "";
    
      editDialogMRVisible: boolean = false;
      selectedMedicalRecord: any = {}; 
      filteredMedicalRecords: MedicalRecord[] = [];
    
      allAllergies: any[] = [];
      allergies: any[] = [];
      filteredAllergies: any[] = [];
      availableAllergies: any[] = [];
      selectedAllergiesId: any[] = [];
      allergiesDialogVisible: boolean = false; 
    
      allMedicalConditions: any[] = [];
      medicalConditions: any[] = [];
      filteredMedicalConditions: any[] = [];
      medicalConditionsDialogVisible: boolean = false; 
      availableMedicalConditions: any[] = [];
      selectedMedicalConditionsId: any[] = [];

    constructor(private patientService: PatientService, private medicalRecordService: MedicalRecordService, 
      private allergyService: AllergyService, private medicalConditionService: MedicalConditionService, private messageService : MessageService) {}

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
        this.medicalRecord = [];
        this.loadMedicalRecord(medicalHistory);
    }

    // Método de busca acionado ao clicar no botão ou alterar filtros
    onSearch(): void {
        this.loadPatients();
    }


    loadMedicalRecord(patientMedicalRecordNumber: string): void {
      console.log('Loading medical record for: ', patientMedicalRecordNumber);
      this.allergies = [];
      this.medicalConditions = [];
    
      this.medicalRecordService.getMedicalRecordByPatientMedicalRecordNumber(patientMedicalRecordNumber).subscribe(
        (medicalRecord) => {
          console.log('Medical record response: ', medicalRecord); // Verifique o retorno aqui
          if (medicalRecord) {
            this.medicalRecord = medicalRecord;
            console.log('Medical record found:', this.medicalRecord);
          } else {
            this.medicalRecord = null;
            console.log('No medical record found');
          }
        },
        (error) => {
          console.error('Error loading medical records', error);
          this.medicalRecord = null;
        }
      );
    }
    
    showAllergies(allergyIds: string[]) {
      console.log("Ids Allergies", allergyIds);
      this.loadAllergies(allergyIds);
      this.allergiesDialogVisible = true;
    }
  
    loadAllergies(allergyIds: string[]) {
      if (!allergyIds || allergyIds.length === 0) {
        console.warn('No allergy IDs provided.');
        this.allergies = [];
        this.availableAllergies = [];
        this.filteredAllergies = []; // Certificar que filteredAllergies é vazio neste caso
        return;
      }
    
      this.allergies = [];
      this.availableAllergies = [];
    
      // Carregar todas as alergias existentes
      this.allergyService.getAllergies().subscribe(
        (allAllergies) => {
          console.log('All allergies loaded:', allAllergies);
    
          if (allergyIds.length === 0) {
            // Se não há IDs de alergias, todas as alergias estão disponíveis
            this.availableAllergies = allAllergies;
            this.filteredAllergies = []; // Garantir que filteredAllergies seja vazio neste caso
          } else {
            // Carregar as alergias associadas ao registro médico
            const allergyObservables = allergyIds.map((id) =>
              this.medicalRecordService.getAllergyById(id)
            );
    
            forkJoin(allergyObservables).subscribe(
              (allergies) => {
                this.allergies = allergies;
                console.log('Allergies loaded:', this.allergies);
    
                // Atribuir as alergias carregadas ao filteredAllergies
                this.filteredAllergies = [...this.allergies];
                console.log('Filtered Allergies:', this.filteredAllergies);
    
                // Filtrar as alergias disponíveis (as que não estão associadas)
                this.availableAllergies = allAllergies.filter(
                  (allergy: any) => !this.allergies.some(
                    (assigned: any) => assigned.id === allergy.id
                  )
                );
    
                console.log('availableAllergies:', this.availableAllergies);
              },
              (error) => {
                console.error('Error loading allergies by ID:', error);
                this.availableAllergies = allAllergies;  // Se erro na busca, mostrar todas as alergias disponíveis
                this.filteredAllergies = []; // Garantir que filteredAllergies seja vazio neste caso
              }
            );
          }
        },
        (error) => {
          console.error('Error loading all allergies:', error);
          this.availableAllergies = [];  // Caso erro ao carregar todas as alergias
          this.filteredAllergies = []; // Garantir que filteredAllergies seja vazio neste caso
        }
      );
    }
    
    
    
    showMedicalConditions(medicalConditionsIds: string[]) {
      this.loadMedicalConditions(medicalConditionsIds);
      this.allergies = [];
      this.medicalConditions = [];
      this.medicalConditionsDialogVisible = true;
    }
  
    loadMedicalConditions(medicalConditionIds: string[]) {
      if (!medicalConditionIds || medicalConditionIds.length === 0) {
        console.warn('No medical condition IDs provided.');
        this.medicalConditions = [];
        this.availableMedicalConditions = [];
        this.filteredMedicalConditions = []; // Certificar que filteredMedicalConditions é vazio neste caso
        return;
      }
    
      this.medicalConditions = [];
      this.availableMedicalConditions = [];
    
      // Carregar todas as condições médicas existentes
      this.medicalConditionService.getMedicalConditions().subscribe(
        (allMedicalConditions) => {
          console.log('All medical conditions loaded:', allMedicalConditions);
    
          if (medicalConditionIds.length === 0) {
            // Se não há IDs de condições médicas, todas estão disponíveis
            this.availableMedicalConditions = allMedicalConditions;
            this.filteredMedicalConditions = []; // Garantir que filteredMedicalConditions seja vazio neste caso
          } else {
            // Carregar as condições médicas associadas ao registro médico
            const medicalConditionObservables = medicalConditionIds.map((id) =>
              this.medicalRecordService.getMedicalConditionById(id)
            );
    
            forkJoin(medicalConditionObservables).subscribe(
              (medicalConditions) => {
                this.medicalConditions = medicalConditions;
                console.log('Medical conditions loaded:', this.medicalConditions);
    
                // Atribuir as condições médicas carregadas ao filteredMedicalConditions
                this.filteredMedicalConditions = [...this.medicalConditions];
                console.log('Filtered Medical Conditions:', this.filteredMedicalConditions);
    
                // Filtrar as condições médicas disponíveis (as que não estão associadas)
                this.availableMedicalConditions = allMedicalConditions.filter(
                  (condition: any) => !this.medicalConditions.some(
                    (assigned: any) => assigned.id === condition.id
                  )
                );
    
                console.log('Available Medical Conditions:', this.availableMedicalConditions);
              },
              (error) => {
                console.error('Error loading medical conditions by ID:', error);
                this.availableMedicalConditions = allMedicalConditions; // Se erro na busca, mostrar todas as condições médicas disponíveis
                this.filteredMedicalConditions = []; // Garantir que filteredMedicalConditions seja vazio neste caso
              }
            );
          }
        },
        (error) => {
          console.error('Error loading all medical conditions:', error);
          this.availableMedicalConditions = []; // Caso erro ao carregar todas as condições médicas
          this.filteredMedicalConditions = []; // Garantir que filteredMedicalConditions seja vazio neste caso
        }
      );
    }
    
    
    
     saveMedicalRecordInfo(selectedMedicalRecord: MedicalRecord) {
        console.log('Saving medical record info:', selectedMedicalRecord);
        
        this.medicalRecordService.updateMedicalRecord(selectedMedicalRecord.id, selectedMedicalRecord).subscribe({
          next: (response) => {
            console.log('Medical record info updated successfully:', response);
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Medical record information updated successfully!',
            });
            
            this.editDialogVisible = false; 
          },
          error: (error) => {
            console.error('Failed to update medical record info:', error);
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update medical record information.',
            });
          },
          complete: () => {
            console.log('Update medical record proccess complete.');
            this.loadMedicalRecord(selectedMedicalRecord.id);
          }
        });
      }

      openEditDialog(item: any) {
        this.selectedMedicalRecord = { ...item };
        this.editDialogMRVisible = true;
        
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
  this.medicalRecordDialogVisible = false;

}

adjustTextarea(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Redefine a altura para calcular o novo tamanho
  textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para o tamanho do conteúdo
}


addSelectedAllergies() {
  this.selectedAllergiesId.forEach((selectedAllergy: any) => {
    // Evitar duplicatas com base no código da alergia
    if (!this.allergies.some((allergy: any) => allergy.code === selectedAllergy.code)) {
      this.allergies.push({
        code: selectedAllergy.code || 'Unknown',
        name: selectedAllergy.name || 'Unnamed Allergy'
      });
      this.filteredAllergies.push({
        code: selectedAllergy.code || 'Unknown',
        name: selectedAllergy.name || 'Unnamed Allergy'
      });
    }
  });
  // Limpar seleção após adicionar
  this.selectedAllergiesId = [];
}

addSelectedMedicalConditions() {
  this.selectedMedicalConditionsId.forEach((selectedMedicalCondition: any) => {

    if (!this.medicalConditions.some((medicalCondition: any) => medicalCondition.code === selectedMedicalCondition.code)) {
      this.medicalConditions.push({
        code: selectedMedicalCondition.code || 'Unknown',
        name: selectedMedicalCondition.name || 'Unnamed Allergy'
      });
      this.filteredMedicalConditions.push({
        code: selectedMedicalCondition.code || 'Unknown',
        name: selectedMedicalCondition.name || 'Unnamed Allergy'
      });
    }
  });
  this.selectedMedicalConditionsId = [];
}

showNotations(notations: string): void {
  this.notationsDialogVisible = true;
  this.selectedNotations = notations;
}

onSearchAllergies(): void {
  this.filteredAllergies = this.allergies.filter(item => {
    const matchesNameAllergy = this.allergyNameFilter
      ? item.name.toLowerCase().startsWith(this.allergyNameFilter.toLowerCase())
      : true;
    const matchesCodeAllergy = this.allergyCodeFilter
      ? item.code.toLowerCase().startsWith(this.allergyCodeFilter.toLowerCase())
      : true;

    return matchesNameAllergy && matchesCodeAllergy;
  });

}

onSearchMedicalConditions(): void {
  this.filteredMedicalConditions = this.medicalConditions.filter(item => {
    const matchesNameMedicalCondition = this.medicalConditionNameFilter
      ? item.name.toLowerCase().startsWith(this.medicalConditionNameFilter.toLowerCase())
      : true;
    const matchesCodeMedicalCondition = this.medicalConditionCodeFilter
      ? item.code.toLowerCase().startsWith(this.medicalConditionCodeFilter.toLowerCase())
      : true;

    return matchesNameMedicalCondition && matchesCodeMedicalCondition;
  });
}
}
