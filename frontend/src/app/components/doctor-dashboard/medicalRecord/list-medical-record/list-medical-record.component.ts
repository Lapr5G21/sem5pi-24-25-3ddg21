import { Component, OnInit } from '@angular/core';
import { MedicalRecord } from '../../../../domain/medical-record-model';
import { AllergyService } from '../../../../services/allergy.service';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { MedicalRecordService } from '../../../../services/medical-record-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-list-medical-record',
  standalone: true,
  templateUrl: './list-medical-record.component.html',
  styleUrls: ['./list-medical-record.component.scss'],
  imports:[
    ToastModule,
    FormsModule,
    MultiSelectModule,
    DialogModule,
    DataViewModule,
    ButtonModule,
    ScrollPanelModule,
    InputTextModule,
    CommonModule,
    FloatLabelModule,],
  providers: [MessageService, AllergyService, MedicalConditionService, MedicalRecordService],
})
export class ListMedicalRecordComponent implements OnInit {
  recordNumberFilter: string = '';
  medicalRecords: MedicalRecord[] = [];
  allergies: any[] = [];
  medicalConditions: any[] = [];
  filteredMedicalRecords: MedicalRecord[] = [];

  editDialogVisible: boolean = false;

  selectedMedicalRecord: MedicalRecord = {
    id: '',
    patientMedicalRecordNumber: '',
    allergies: [],
    medicalConditions: [],
    
  };

  constructor(
    private medicalRecordService: MedicalRecordService,
    private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
    this.loadAllergies();
    this.loadMedicalConditions();
  }

  loadMedicalRecords(): void {
    this.medicalRecordService.getMedicalRecord().subscribe({
      next: (records) => {
        console.log('Medical Records Data:', records);
        this.medicalRecords = records.map((record) => ({
          ...record,
          allergies: record.allergies || [], 
          medicalConditions: record.medicalConditions || [], 
        }));
        console.log('Medical Records that got:', records);
        this.filteredMedicalRecords = records;
      },
      error: (error) => console.error('Error loading medical records', error),
    });
  }

  loadAllergies(): void {
    this.allergyService.getAllergies().subscribe({
      next: (allergies) => (this.allergies = allergies),
      error: (error) => console.error('Error loading allergies', error),
    });
  }

  loadMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe({
      next: (conditions) => (this.medicalConditions = conditions),
      error: (error) =>
        console.error('Error loading medical conditions', error),
    });
  }

  onSearch(): void {
    if (!this.recordNumberFilter) {
      this.filteredMedicalRecords = [...this.medicalRecords];
    } else {
      this.filteredMedicalRecords = this.medicalRecords.filter((record) =>
        record.patientMedicalRecordNumber
          .toLowerCase()
          .includes(this.recordNumberFilter.toLowerCase())
      );
    }
  }

  openEditDialog(record: MedicalRecord): void {
    this.selectedMedicalRecord = { ...record };
    this.editDialogVisible = true;
  }

  saveMedicalRecord(): void {
    if (!this.selectedMedicalRecord) return;

    this.medicalRecordService
      .updateMedicalRecord(this.selectedMedicalRecord.id, this.selectedMedicalRecord)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Medical record updated successfully!',
          });
          this.editDialogVisible = false;
          this.loadMedicalRecords();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update medical record.',
          }),
      });
  }
}
