import { Component, OnInit, Input } from '@angular/core';
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
import { EditStaffDto } from '../../../../domain/staff-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'edit-staffs-modal',
    templateUrl: './edit-staffs.component.html',
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
export class EditStaffsComponent implements OnInit {
    @Input() staffId: string | null = null; // ID do staff a ser editado
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
        if (this.staffId) {
            this.loadStaffDetails();
        }
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

    loadStaffDetails() {
        this.staffService.getStaffById(this.staffId!).subscribe(
            (staff) => {
                this.staffFirstName = staff.firstName;
                this.staffLastName = staff.lastName;
                this.staffFullName = staff.fullName;
                this.staffLicenseNumber = staff.licenseNumber;
                this.selectedSpecializations = staff.specializations.map((s: { specializationId: any; }) => s.specializationId);
                this.staffEmail = staff.email;
                this.staffPhoneNumber = staff.phoneNumber;
                this.staffAvailabilitySlots = staff.availabilitySlots;
                this.username = staff.username;
            },
            (error) => {
                console.error('Erro ao carregar detalhes do staff:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os detalhes do staff.'
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
    
        const staff = new EditStaffDto(
            this.staffId!,
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
    
        this.staffService.updateStaff(staff).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Staff atualizado com sucesso!'
                });
                this.resetForm();
                this.visible = false;
            },
            (error) => {
                console.error('Erro ao atualizar staff:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível atualizar o staff.'
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
