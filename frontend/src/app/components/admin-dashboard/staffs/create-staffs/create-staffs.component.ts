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
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'create-staffs-modal',
    templateUrl: './create-staffs.component.html',
    styleUrls: ['./create-staffs.component.scss'],
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
    providers: [StaffService, MessageService]
})
export class CreateStaffsComponent implements OnInit {
    visible: boolean = false;
    optionListSpecs: SelectItem[] = [];
    optionListUsers: SelectItem[] = [];
    selectedSpecializations: string = '';

    staffFirstName: string = '';
    staffLastName: string = '';
    staffFullName: string = '';
    staffLicenseNumber: string = '';
    staffEmail: string = '';
    staffPhoneNumber: string = '';
    staffAvailabilitySlots: string = '';
    selectedUsers: string = '';

    isPhoneNumberValid: boolean = true;
    isEmailValid: boolean = true;
    isFirstNameValid: boolean = true;
    isLastNameValid: boolean = true;
    isFullNameValid: boolean = true;
    isLicenseNumberValid: boolean = true;
    isUserValid: boolean = true;
    isSpecValid: boolean = true;

    isSubmitted: boolean = false;


    constructor(
        private staffService: StaffService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadSpecializations();
        this.loadUsers();
    }

    loadSpecializations() {
        this.staffService.getSpecializations().subscribe(
            (specializations) => {
                this.optionListSpecs = specializations.map(spec => ({
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
    
    loadUsers() {
        this.staffService.getUsers().subscribe(
            (users) => {
                this.optionListUsers = users.map(user => ({
                    label: user.username,
                    value: user.username
                }));
            },
            (error) => {
                console.error('Erro ao carregar utilizadores:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os utilizadores.'
                });
            }
        );
    }

    showDialog() {
        this.visible = true;
    }

    saveStaff() {
        this.isSubmitted = true; // Isso vai garantir que as validações sejam feitas somente ao tentar salvar
        this.validateFields();
        if (this.isFirstNameValid && this.isLastNameValid && this.isFullNameValid && this.isLicenseNumberValid && this.isSpecValid && this.isUserValid) {     const specializationIds = this.selectedSpecializations;
            const userNames = this.selectedUsers;

            const staff = new CreateStaffDto(
                this.staffFirstName,
                this.staffLastName,
                this.staffFullName,
                this.staffLicenseNumber,
                specializationIds.toString(),
                this.staffEmail,
                this.staffPhoneNumber,
                userNames.toString()
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
                    this.isSubmitted = false; // Reset ao estado após salvar
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
    }
    
    validateFields() {
        this.isFirstNameValid = !!this.staffFirstName;
        this.isLastNameValid = !!this.staffLastName;
        this.isFullNameValid = !!this.staffFullName;
        this.isLicenseNumberValid = !!this.staffLicenseNumber;
        this.isSpecValid = !!this.selectedSpecializations;
        this.isUserValid = !!this.selectedUsers;
        this.validateEmail();
        this.validatePhoneNumber();
    }

    validatePhoneNumber(): void {
        const phonePattern = /^(91|92|93|96)\d{7}$/;
        this.isPhoneNumberValid = phonePattern.test(this.staffPhoneNumber);
    }

    validateEmail(): void {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.isEmailValid = emailPattern.test(this.staffEmail);
    }

    allowOnlyNumbers(event: KeyboardEvent) {
        const pattern = /^[0-9]*$/;
        if (!pattern.test(event.key)) {
            event.preventDefault();
        }
    }
 

    resetForm() {
        this.staffFirstName = '';
        this.staffLastName = '';
        this.staffFullName = '';
        this.staffLicenseNumber = '';
        this.selectedSpecializations = '';
        this.staffEmail = '';
        this.staffPhoneNumber = '';
        this.staffAvailabilitySlots = '';
        this.selectedUsers = '';
        this.isSubmitted = false;
        this.isFirstNameValid = true;
        this.isLastNameValid = true;
        this.isFullNameValid = true;
        this.isLicenseNumberValid = true;
        this.isEmailValid = true;
        this.isPhoneNumberValid = true;
        this.isSpecValid = true;
        this.isUserValid = true;
    }
}
