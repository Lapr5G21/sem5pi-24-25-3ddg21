import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../../services/staff.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateStaffDto } from '../../../../domain/staff-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'create-staffs-modal',
    templateUrl: './create-staffs.component.html',
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
    providers: [StaffService, MessageService]
})
export class CreateStaffsComponent implements OnInit {
    visible: boolean = false;
    optionList: SelectItem[] = [];
    selectedSpecializations: string[] = [];

    staffFirstName: string = '';
    staffLastName: string = '';
    staffFullName: string = '';
    staffLicenseNumber: string = '';
    staffEmail: string = '';
    staffPhoneNumber: string = '';
    staffAvailabilitySlots: string = '';
    username: string = '';

    constructor(
        private staffService: StaffService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadSpecializations();
    }

    loadSpecializations() {
        this.staffService.getSpecializations().subscribe(
            (specializations) => {
                this.optionList = specializations.map(spec => ({
                    label: spec.specializationName,
                    value: spec.id
                }));
            },
            (error) => {
                console.error('Erro ao carregar especializações:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar as especializações.'
                });
            }
        );
    }
    
    showDialog() {
        this.visible = true;
    }

    saveStaff() {
        console.log('Selected Specializations:', this.selectedSpecializations);
    
        const specializationDtos = this.selectedSpecializations.map(specializationId => ({ specializationId }));
    
        const staff = new CreateStaffDto(
            this.staffFirstName,
            this.staffLastName,
            this.staffFullName,
            this.staffLicenseNumber,
            specializationDtos,
            this.staffEmail,
            this.staffPhoneNumber,
            this.staffAvailabilitySlots,
            this.username
        );
    
        console.log('Payload:', JSON.stringify(staff));
    
        this.staffService.saveStaff(staff).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Staff salvo com sucesso!'
                });
                this.resetForm();
                this.visible = false;
            },
            (error) => {
                console.error('Erro ao salvar staff:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o staff.'
                });
            }
        );
    }
    

    resetForm() {
        this.staffFirstName = '';
        this.staffLastName = '';
        this.staffFullName = '';
        this.staffLicenseNumber = '';
        this.selectedSpecializations = [];
        this.staffEmail = '';
        this.staffPhoneNumber = '';
        this.staffAvailabilitySlots = '';
        this.username = '';
    }
}
