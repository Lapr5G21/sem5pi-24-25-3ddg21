import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { AllergyService } from '../../../../services/allergy.service';
import { MedicalCondition } from '../../../../domain/medical-condition-model';
import { Allergy } from '../../../../domain/allergy-model';
import { MedicalRecordService } from '../../../../services/medical-record-service';

@Component({
  selector: 'create-medical-record',
  standalone: true,
  imports: [
    DialogModule,
    ToastModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    CommonModule
  ],
  templateUrl: './create-medical-record.component.html',
  styleUrl: './create-medical-record.component.scss'
})
export class CreateMedicalRecordComponent {
  visible: boolean = false;

  patient: { label: string; value: string }[] = [];
  selectedPatient: { label: string; value: string } | null = null;

  medicalConditions: MedicalCondition[] = [];
  allergies: Allergy[] = [];

  patientMedicalRecord: string = '';

  selectedMedicalConditions: { label: string; value: string }[] = [];
  selectedAllergies: { label: string; value: string }[] = [];

  selectedMedicalConditionsId: any[] = [];
  selectedAllergiesId: any[] = [];

  constructor(
    private medicalRecordService: MedicalRecordService,
    private operationRequestService: OperationRequestService,
    private medicalConditionService: MedicalConditionService,
    private allergyService: AllergyService,
    private messageService: MessageService
  ) {}

  loadAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (allergies) => {
        this.allergies = allergies;
        this.selectedAllergies = allergies.map((allergy) => ({
          label: allergy.name,
          value: allergy.id
        }));
        console.log('Allergies loaded successfully!', allergies);
      },
      (error) => console.error('Error loading allergies', error)
    );
  }

  loadMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (medicalConditions) => {
        this.medicalConditions = medicalConditions;
        this.selectedMedicalConditions = medicalConditions.map((condition) => ({
          label: condition.name,
          value: condition.id
        }));
        console.log('Medical Conditions loaded successfully!', medicalConditions);
      },
      (error) => console.error('Error loading medical conditions', error)
    );
  }

  loadPacients() {
    this.operationRequestService.getPatients().subscribe(
      (patients) => {
        this.patient = patients.map((patient) => ({
          label: patient.fullName,
          value: patient.medicalRecordNumber
        }));
        console.log('Patients loaded successfully!', patients);
      },
      (error) => console.error('Error loading patients', error)
    );
  }

  ngOnInit() {
    this.loadMedicalConditions();
    this.loadAllergies();
    this.loadPacients();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.visible) {
      this.resetForm();
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  saveMedicalRecord() {
    console.log('Patient:', this.selectedPatient);
    console.log('Allergies:', this.selectedAllergies);
    console.log('Medical Conditions:', this.selectedMedicalConditions);

    if (!this.selectedPatient) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'The patient field is required!'
      });
      console.error('The patient field is required!');
      return;
    }

    const medicalRecord = {
      patientMedicalRecordNumber: this.selectedPatient.value,
      allergiesId: this.selectedAllergiesId.map((allergy) => allergy.value),
      medicalConditionsId: this.selectedMedicalConditionsId.map((condition) => condition.value)
    };

    console.log('Payload:', medicalRecord);

    this.medicalRecordService.saveMedicalRecord(medicalRecord).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Medical Record Successfully Saved!'
        });
        console.log('Medical record saved successfully!');
        this.resetForm();
        this.visible = false;
      },
      (error) => {
        console.error('Error saving medical record', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The medical record could not be saved!'
        });
      }
    );
  }

  isFormValid(): boolean {
    return this.selectedPatient !== null;
  }

  resetForm() {
    this.selectedPatient = null;
    this.selectedAllergies = [];
    this.selectedMedicalConditions = [];
  }
}
