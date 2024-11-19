import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';


@Component({
    selector: 'list-patients',
    templateUrl: './list-patients.component.html',
    styleUrls: ['./list-patients.component.scss'],
    standalone: true,
    imports: [
        TableModule,
        DialogModule,
        DataViewModule,
        ButtonModule,
        CommonModule,
        BadgeModule,
        ScrollPanelModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        FloatLabelModule,
        CalendarModule,
        PaginatorModule
    ],
})
export class ListPatientsComponent implements OnInit {
    // Opções de status para o filtro
    statusOptions: { label: string, value: boolean}[] = [
        { label: 'Active', value: true },
        { label: 'Deactivated', value: false }
    ];

    patients: any[] = [];

    // Filtros
    nameFilter: string = '';
    birthDateFilter: string = '';
    genderFilter: string = '';
    emailFilter: string = '';
    phoneNumberFilter: string = '';
    mrnFilter: string = '';
    statusFilter: boolean = true;

    medicalHistoryDialogVisible: boolean = false;
    selectedMedicalHistory: string = '';

    constructor(private patientService: PatientService) {}

    ngOnInit(): void {
        this.loadPatients();
    }

    // Carrega os pacientes com base nos filtros aplicados
    loadPatients(): void {
        const statusBoolean = this.statusFilter;
        this.patientService
            .searchPatients(this.nameFilter, this.birthDateFilter, this.genderFilter, this.emailFilter, this.phoneNumberFilter, this.mrnFilter, statusBoolean)
            .subscribe(
                (patients) => {
                    console.log('Patients received:', patients);
                    this.patients = patients;
                },
                (error) => {
                    console.error('Error loading patients:', error);
                }
            );
    }

    // Mostra o histórico médico em um diálogo
    showMedicalHistory(medicalHistory: string): void {
        this.selectedMedicalHistory = medicalHistory;
        this.medicalHistoryDialogVisible = true;
    }

    // Método de busca acionado ao clicar no botão ou alterar filtros
    onSearch(): void {
        this.loadPatients();
    }
}
