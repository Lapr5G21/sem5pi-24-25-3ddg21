import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { PatientService } from '../../../../services/patient.service';
import { HttpClientModule } from '@angular/common/http';
import { CreatePatientDto, Patient } from '../../../../domain/patient-model';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

enum PatientGender {
    Male = 'Male',
    Female = 'Female',
    RatherNotSay = 'RatherNotSay'
}

@Component({
    selector: 'create-patients-modal',
    templateUrl: './create-patients.component.html',
    styleUrls: ['./create-patients.component.scss'], // Certifique-se que este caminho está correto
    standalone: true,
    imports: [
        DialogModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
        FormsModule,
        CommonModule,
        HttpClientModule,
        ToastModule,
        CalendarModule
    ],
    providers: [PatientService, MessageService]
})
export class CreatePatientsComponent {
    visible: boolean = false;
    optionList: SelectItem[] = [];

    FirstName: string = '';
    LastName: string = '';
    FullName: string = '';
    BirthDate: string = '';
    auxBirthDate: Date | null = null;    
    Gender : string = PatientGender.RatherNotSay; // Usando enum como tipo
    Email: string = '';
    PhoneNumber: string = '';
    Address: string = '';
    EmergencyContact : string = '';

    // Lista de opções para o dropdown de gênero
    patientGenderOptions: SelectItem[] = [
        { label: 'Male', value: PatientGender.Male },
        { label: 'Female', value: PatientGender.Female },
        { label: 'RatherNotSay', value: PatientGender.RatherNotSay }
    ];
    
    isPhoneNumberValid: boolean = true;
    isEmailValid: boolean = true;
    isAddressValid: boolean = true;
    isFirstNameValid: boolean = true;
    isLastNameValid: boolean = true;
    isFullNameValid: boolean = true;
    isEmergencyContactValid: boolean = true;
    isGenderValid: boolean = true;

    isSubmitted: boolean = false;

    constructor(
        private patientService: PatientService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.visible = true;
    }

    savePatient() {
        this.isSubmitted = true;
        this.validateFields();

        console.log('Gender before saving:', this.Gender); 

        if (this.isFirstNameValid && this.isLastNameValid && this.isFullNameValid && this.isGenderValid && this.isPhoneNumberValid && this.isEmailValid && this.isAddressValid && this.isEmergencyContactValid) {
                
            const patient = new CreatePatientDto(
            this.FirstName,
            this.LastName,
            this.FullName,
            this.BirthDate,
            this.Gender,
            this.Email,
            this.PhoneNumber,
            this.Address,
            this.EmergencyContact,
        );

        console.log('Payload:', JSON.stringify(patient));

        this.patientService.savePatient(patient).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Patient Successfully Saved!'
                });
                this.resetForm();
                this.visible = false;
                this.isSubmitted = false;
            },
            (error) => {
                console.error('Patient Saving Error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'The patient could not be saved'
                });
            }
        );
    }
    }


    
    validateFields() {
        this.isFirstNameValid = !!this.FirstName;
        this.isLastNameValid = !!this.LastName;
        this.isFullNameValid = !!this.FullName;
        this.isGenderValid = !!this.Gender;
        this.isPhoneNumberValid = !!this.PhoneNumber;
        this.isEmailValid = !!this.Email;
        this.isAddressValid = !!this.Address;
        this.isEmergencyContactValid = !!this.EmergencyContact;
    }

    dateToString(date: Date): string {
        if (!date) {
          return '';
        }
        // Converte para o formato yyyy-MM-dd
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda
        const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda
        return `${day}-${month}-${year}`;
      }

      onBirthDateChange(date: Date): void {
        this.BirthDate = this.dateToString(date); // Converte para string para manter consistência
        console.log('Updated Birth Date:', this.BirthDate);
      }
    
    resetForm() {
        this.FirstName = '';
        this.LastName = '';
        this.FullName = '';
        this.BirthDate = '';
        this.auxBirthDate = null;
        this.Gender = PatientGender.RatherNotSay;;
        this.Email = '';
        this.PhoneNumber = '';
        this.Address = '';
        this.EmergencyContact = '';
        this.isFirstNameValid = true;
        this.isLastNameValid = true;
        this.isFullNameValid = true;
        this.isGenderValid = true;
        this.isPhoneNumberValid = true;
        this.isEmailValid = true;
        this.isAddressValid = true;
        this.isEmergencyContactValid = true;
        this.isSubmitted = false;


    }
}

