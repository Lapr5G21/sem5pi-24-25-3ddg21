import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../services/patient.service';
import { HttpClientModule } from '@angular/common/http';
import { CreatePatientDto } from '../../../../domain/patient-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'create-patients-modal',
    templateUrl: './create-patients.component.html',
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
        ToastModule
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
    Gender: string = '';
    Email: string = '';
    PhoneNumber: string = '';
    Address: string = '';
    EmergencyContact : string = '';

    constructor(
        private patientService: PatientService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.visible = true;
    }

    savePatient() {

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

    resetForm() {
        this.FirstName = '';
        this.LastName = '';
        this.FullName = '';
        this.BirthDate = '';
        this.Gender = '';
        this.Email = '';
        this.PhoneNumber = '';
        this.Address = '';
        this.EmergencyContact = '';

    }
}

