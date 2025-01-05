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
    statusOptions: { label: string, value: boolean}[] = [
        { label: 'Active', value: true },
        { label: 'Deactivated', value: false }
    ];

    patients: any[] = [];

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
      allergiesIds: any[] = [];
      filteredAllergies: any[] = [];
      availableAllergies: any[] = [];
      selectedAllergiesId: any[] = [];
      allergiesDialogVisible: boolean = false; 
    
      allMedicalConditions: any[] = [];
      medicalConditions: any[] = [];
      medicalConditionsIds: any[] = [];
      filteredMedicalConditions: any[] = [];
      medicalConditionsDialogVisible: boolean = false; 
      availableMedicalConditions: any[] = [];
      selectedMedicalConditionsId: any[] = [];

    constructor(private patientService: PatientService, private medicalRecordService: MedicalRecordService, 
      private allergyService: AllergyService, private medicalConditionService: MedicalConditionService, private messageService : MessageService) {}

    ngOnInit(): void {
        this.loadPatients();
    }

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

    showMedicalHistory(medicalHistory: string): void {
        this.selectedMedicalHistory = medicalHistory;
        this.medicalHistoryDialogVisible = true;
        this.medicalRecord = [];
        this.loadMedicalRecord(medicalHistory);
    }

    onSearch(): void {
        this.loadPatients();
    }


    loadMedicalRecord(patientMedicalRecordNumber: string): void {
      console.log('Loading medical record for: ', patientMedicalRecordNumber);
      this.allergies = [];
      this.medicalConditions = [];
    
      this.medicalRecordService.getMedicalRecordByPatientMedicalRecordNumber(patientMedicalRecordNumber).subscribe(
        (medicalRecord) => {
          console.log('Medical record response: ', medicalRecord);
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
    
    showAllergies(medicalRecord: any) {
      this.selectedMedicalRecord = medicalRecord;
      this.allergiesIds = medicalRecord.allergiesId;
      console.log("Ids Allergies", this.allergiesIds);
      this.loadAllergies(this.allergiesIds);
      this.allergies = [];
      this.allergiesDialogVisible = true;
    }
  
    loadAllergies(allergyIds: string[]) {
      if (!allergyIds || allergyIds.length === 0) {
        console.warn('No allergy IDs provided. Loading all allergies as available.');
        this.allergyService.getAllergies().subscribe(
          (allAllergies) => {
            this.availableAllergies = allAllergies;
            this.filteredAllergies = [];
            this.allergies = [];
          },
          (error) => {
            console.error('Error loading all allergies:', error);
            this.availableAllergies = [];
            this.filteredAllergies = [];
          }
        );
        return;
      }
    
      this.allergies = [];
      this.availableAllergies = [];
    
      this.allergyService.getAllergies().subscribe(
        (allAllergies) => {
    
          const allergyObservables = allergyIds.map((id) =>
            this.medicalRecordService.getAllergyById(id)
          );
    
          forkJoin(allergyObservables).subscribe(
            (allergies) => {
              this.allergies = allergies;
              this.filteredAllergies = [...this.allergies];
              this.availableAllergies = allAllergies.filter(
                (allergy: any) =>
                  !this.allergies.some(
                    (assigned: any) => assigned.id === allergy.id
                  )
              );
    
            },
            (error) => {
              console.error('Error loading allergies by ID:', error);
              this.availableAllergies = allAllergies;
              this.filteredAllergies = [];
            }
          );
        },
        (error) => {
          console.error('Error loading all allergies:', error);
          this.availableAllergies = [];
          this.filteredAllergies = [];
        }
      );
    }
    
    
    addSelectedAllergies() {
      this.selectedAllergiesId.forEach((selectedAllergy: any) => {
        if (!this.allergies.some((allergy: any) => allergy.code === selectedAllergy.code)) {
          this.allergies.push({
            code: selectedAllergy.code || 'Unknown',
            name: selectedAllergy.name || 'Unnamed Allergy'
          });
          this.filteredAllergies.push({
            code: selectedAllergy.code || 'Unknown',
            name: selectedAllergy.name || 'Unnamed Allergy'
          });
          if (selectedAllergy.id) {
            this.allergiesIds.push(selectedAllergy.id);
          }
        }
      });
      this.selectedAllergiesId = [];
      this.selectedMedicalRecord.allergiesId = this.allergiesIds;
      this.saveMedicalRecordInfo(this.selectedMedicalRecord);
      this.loadAllergies(this.allergiesIds);
      }
    
    
    showMedicalConditions(medicalRecord: any) {
      this.selectedMedicalRecord = medicalRecord;
      this.medicalConditionsIds = medicalRecord.medicalConditionsId;
      this.loadMedicalConditions(this.medicalConditionsIds);
      this.medicalConditions = [];
      this.medicalConditionsDialogVisible = true;
    }

    loadMedicalConditions(medicalConditionIds: string[]) {
      if (!medicalConditionIds || medicalConditionIds.length === 0) {
        
        this.medicalConditionService.getMedicalConditions().subscribe(
          (allMedicalConditions) => {
            this.availableMedicalConditions = allMedicalConditions;
            this.filteredMedicalConditions = [];
            this.medicalConditions = [];
          },
          (error) => {
            console.error('Error loading all medical conditions:', error);
            this.availableMedicalConditions = [];
            this.filteredMedicalConditions = [];
          }
        );
        return;
      }
    
      this.medicalConditions = [];
      this.availableMedicalConditions = [];
    
      this.medicalConditionService.getMedicalConditions().subscribe(
        (allMedicalConditions) => {
    
          const medicalConditionObservables = medicalConditionIds.map((id) =>
            this.medicalRecordService.getMedicalConditionById(id)
          );
    
          forkJoin(medicalConditionObservables).subscribe(
            (medicalConditions) => {
              this.medicalConditions = medicalConditions;   
              this.filteredMedicalConditions = [...this.medicalConditions];
              this.availableMedicalConditions = allMedicalConditions.filter(
                (condition: any) =>
                  !this.medicalConditions.some(
                    (assigned: any) => assigned.id === condition.id
                  )
              );
    
            },
            (error) => {
              console.error('Error loading medical conditions by ID:', error);
              this.availableMedicalConditions = allMedicalConditions;
              this.filteredMedicalConditions = [];
            }
          );
        },
        (error) => {
          console.error('Error loading all medical conditions:', error);
          this.availableMedicalConditions = [];
          this.filteredMedicalConditions = [];
        }
      );
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
          if (selectedMedicalCondition.id) {
            this.medicalConditionsIds.push(selectedMedicalCondition.id);
          }
        }
      });
      this.selectedMedicalConditionsId = [];
      this.selectedMedicalRecord.medicalConditionsId = this.medicalConditionsIds;
      this.saveMedicalRecordInfo(this.selectedMedicalRecord);
      this.loadMedicalConditions(this.medicalConditionsIds);
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
            this.medicalRecord = selectedMedicalRecord;
          }
        });
      }

      openEditDialog(item: any) {
        this.selectedMedicalRecord = { ...item };
        this.editDialogMRVisible = true;
        
      }

  openMedicalRecordDialog(): void {
    if (this.selectedPatient) {
      this.medicalRecordDialogVisible = true;
    } else {
      console.error('No patient selected for editing medical record!');
    }
  }

  closeMedicalRecordDialog(): void {
    this.medicalRecordDialogVisible = false;
  }

  adjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
