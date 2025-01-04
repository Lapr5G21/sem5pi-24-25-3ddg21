import { Component, OnInit } from '@angular/core';
import { MedicalRecordService } from '../../../../services/medical-record-service';
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
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MedicalRecord } from '../../../../domain/medical-record-model';


@Component({
  selector: 'list-medical-record',
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
    CheckboxModule
  ],
  templateUrl: './list-medical-record.component.html',
  styleUrl: './list-medical-record.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class ListMedicalRecordComponent implements OnInit {
  allergyNameFilter: string = '';
  numberFilter: string = '';
  allergyCodeFilter: string = '';
  medicalConditionNameFilter: string = '';
  medicalConditionCodeFilter: string = '';

  medicalRecords: MedicalRecord[] = [];

  editDialogVisible: boolean = false;
  selectedMedicalRecord: any = {}; 
  filteredMedicalRecords: MedicalRecord[] = [];
  notationsDialogVisible: boolean = false;
  selectedNotations = "";

  allergies: any[] = [];
  filteredAllergies: any[] = [];
  allergiesDialogVisible: boolean = false; 
  descriptionAllergyDialogVisible: boolean =  false;
  selectedAllergyDescription = "";

  medicalConditions: any[] = [];
  filteredMedicalConditions: any[] = [];
  medicalConditionsDialogVisible: boolean = false; 
  descriptionMedicalConditionDialogVisible: boolean =  false;
  selectedMedicalConditionDescription = "";
  symptomsMedicalConditionDialogVisible: boolean =  false;
  selectedMedicalConditionSymptoms = "";

  constructor(private medicalRecordService: MedicalRecordService, private messageService : MessageService,  private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();  
  }

  loadMedicalRecords(): void {
    
    this.medicalRecordService.getMedicalRecords().subscribe(
        (medicalRecords) => {
            this.medicalRecords = medicalRecords;   
            this.filteredMedicalRecords = [...this.medicalRecords];
        },
        (error) => console.error('Error loading medical records', error)
    );
  }


  onSearch(): void {
    this.filteredMedicalRecords = this.medicalRecords.filter(item => {
      const matchesNumber = this.numberFilter
        ? item.patientMedicalRecordNumber.toLowerCase().startsWith(this.numberFilter.toLowerCase())
        : true;
  
      return matchesNumber;
    });
  
    if (this.filteredMedicalRecords.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Results',
        detail: 'No medical records found matching the criteria.',
      });
    }
  }
  
  
  showAllergies(allergyIds: string[]) {
    this.loadAllergies(allergyIds);
    this.allergiesDialogVisible = true;
  }

  loadAllergies(allergyIds: string[]) {
    if (!allergyIds || allergyIds.length === 0) {
      console.warn('No allergy IDs provided.');
      this.allergies = [];
      this.filteredAllergies = [];
      return;
    }
  
    this.allergies = [];
  
    const allergyRequests = allergyIds.map((id) => 
      this.medicalRecordService.getAllergyById(id).toPromise().catch((error) => {
        console.error(`Error loading allergy with ID ${id}:`, error);
        return null;
      })
    );
  
    Promise.all(allergyRequests).then((allergies) => {
      this.allergies = allergies.filter((allergy) => allergy !== null);      
      this.filteredAllergies = [...this.allergies];
    });
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

  showMedicalConditions(medicalConditionsIds: string[]) {
    this.loadMedicalConditions(medicalConditionsIds);
    this.medicalConditionsDialogVisible = true;
  }

  loadMedicalConditions(medicalConditionsIds: string[]) {
    if (!medicalConditionsIds || medicalConditionsIds.length === 0) {
      console.warn('No medical conditions IDs provided.');
      this.medicalConditions = [];
      this.filteredMedicalConditions = [];
      return;
    }
  
    this.medicalConditions = [];
  
    const medicalContionRequests = medicalConditionsIds.map((id) => 
      this.medicalRecordService.getMedicalConditionById(id).toPromise().catch((error) => {
        console.error(`Error loading medical condition with ID ${id}:`, error);
        return null; 
      })
    );
  
    Promise.all(medicalContionRequests).then((medicalConditions) => {
      this.medicalConditions = medicalConditions.filter((medicalCondition) => medicalCondition !== null);  
      this.filteredMedicalConditions = [...this.medicalConditions];
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

  showAllergyDescription(description: string): void {
    this.descriptionAllergyDialogVisible = true;
    this.selectedAllergyDescription = description;
  }

  showMedicalConditionDescription(description: string): void {
    this.descriptionMedicalConditionDialogVisible = true;
    this.selectedMedicalConditionDescription = description;
  }

  showMedicalConditionSymptoms(symptoms: string): void {
    this.symptomsMedicalConditionDialogVisible = true;
    this.selectedMedicalConditionSymptoms = symptoms;
  }

  showNotations(notations: string): void {
    this.notationsDialogVisible = true;
    this.selectedNotations = notations;
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
          this.loadMedicalRecords();
        }
      });
    }
}
