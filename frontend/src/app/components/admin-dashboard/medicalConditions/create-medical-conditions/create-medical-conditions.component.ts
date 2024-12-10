import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateMedicalConditionDto } from '../../../../domain/medical-condition-model';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-medical-conditions',
  templateUrl: './create-medical-conditions.component.html',
  styleUrl: './create-medical-conditions.component.scss',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    TableModule,
    FormsModule,
    DropdownModule,
    CommonModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [MedicalConditionService, MessageService]
})
export class CreateMedicalConditionsComponent {
  visible: boolean = false;
  name: string = '';
  code: string = '';
  description: string = '';
  symptoms: string = '';

  isNameValid: boolean = true;
  isCodeValid: boolean = true;
  isDescriptionValid: boolean = true;
  isSymptomsValid: boolean = true;

  isSubmitted: boolean = false;

  constructor(
    private medicalConditionService: MedicalConditionService,
    private messageService: MessageService
) {}

    showDialog() {
        this.visible = true;
    }


    saveMedicalCondition() {
      this.isSubmitted = true;
      this.validateFields();
      if (this.isNameValid && this.isCodeValid && this.isDescriptionValid && this.isSymptomsValid) {

          const medicalCondition = new CreateMedicalConditionDto(
              this.name,
              this.code,
              this.description,
              this.symptoms
          );

          console.log('Payload:', JSON.stringify(medicalCondition));

          this.medicalConditionService.saveMedicalCondition(medicalCondition).subscribe(
              () => {
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Sucess',
                      detail: 'Medical condition saved successfully!'
                  });
                  this.resetForm();
                  this.visible = false;
                  this.isSubmitted = false;

                  setTimeout(() => {
                      window.location.reload();
                  }, 500); 
              },
              (error) => {
                  console.error('Error saving medical condition:', error);
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Unable to save medical condition.'
                  });
              }
          );
      }
  }
  
  validateFields() {
      this.isNameValid = !!this.name;
      this.isCodeValid = !!this.code;
      this.isDescriptionValid = !!this.description;
      this.isSymptomsValid = !!this.symptoms;
  }

  resetForm() {
      this.name = '';
      this.code = '';
      this.description = '';
      this.symptoms = '';
      this.isSubmitted = false;
      this.isNameValid = true;
      this.isCodeValid = true;
      this.isDescriptionValid = true;
      this.isSymptomsValid = true;
  }
}
