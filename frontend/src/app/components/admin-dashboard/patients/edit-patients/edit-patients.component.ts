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
import { EditPatientDto } from '../../../../domain/patient-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'edit-patients-modal',
    templateUrl: './edit-patients.component.html',
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
export class EditPatientsComponent {
    visible: boolean = false;
    optionList: SelectItem[] = [];

    FirstName: string = '';
    LastName: string = '';
    FullName: string = '';
    MedicalRecord : string = '';
    Email: string = '';
    PhoneNumber: string = '';
    Address: string = '';

    constructor(
        private patientService: PatientService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.visible = true;
    }

    savePatient() {

        const patient = new EditPatientDto(
            this.FirstName,
            this.LastName,
            this.FullName,
            this.MedicalRecord,
            this.Email,
            this.PhoneNumber,
            this.Address,
        );

        console.log('Payload:', JSON.stringify(patient));

        this.patientService.updatePatient(patient).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Patient Successfully Updated!'
                });
                this.resetForm();
                this.visible = false;
            },
            (error) => {
                console.error('Patient Updating Error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'The patient could not be updated'
                });
            }
        );
    }

    resetForm() {
        this.FirstName = '';
        this.LastName = '';
        this.FullName = '';
        this.MedicalRecord = '';
        this.Email = '';
        this.PhoneNumber = '';
        this.Address = '';

    }
}

