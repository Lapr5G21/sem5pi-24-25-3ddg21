import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { AllergyService } from '../../../../services/allergy.service';
import { MessageService, SelectItem } from 'primeng/api';
import { MedicalRecordService } from '../../../../services/medical-record-service';

@Component({
  selector: 'create-medical-records',
  standalone: true,
  imports: [DialogModule,
          ButtonModule,
          InputTextModule,
          MultiSelectModule,
          TableModule,
          FormsModule,
          CommonModule,
          ToastModule],
  templateUrl: './create-medical-records.component.html',
  styleUrl: './create-medical-records.component.scss',
  providers: [MedicalRecordService, MessageService, AllergyService, MedicalConditionService]
})
export class CreateMedicalRecordsComponent implements OnInit {
  visible: boolean = false;
optionList: SelectItem[] = [];
selectedAllergy: { label: string; value: string }[] = [];
selectedMedicalCondition: { label: string; value: string }[] = [];

constructor(
        private medicalRecordService: MedicalRecordService,
        private messageService: MessageService,
        private allergyService: AllergyService,
        private medicalConditionService: MedicalConditionService
    ) {}

    ngOnInit() {
      this.loadAllergies();
      this.loadMedicalConditions();
  }


  loadAllergies() {
    this.allergyService.getAllergies().subscribe(
        (allergies) => {
            this.selectedAllergy = allergies.map(doc => ({
                label: doc.name,
                value: doc.Id 
            }));
            console.log(this.selectedAllergy);  
        },
        (error) => console.error('Error loading allergies', error)
    );
}

loadMedicalConditions() {
  this.medicalConditionService.getMedicalConditions().subscribe(
      (medicalConditions) => {
          this.selectedMedicalCondition = medicalConditions.map(doc => ({
              label: doc.name,
              value: doc.Id 
          }));
          console.log(this.selectedMedicalCondition); 
      },
      (error) => console.error('Error loading Medical Conditions', error)
  );
}

showDialog() {
  this.visible = true;
}


}
