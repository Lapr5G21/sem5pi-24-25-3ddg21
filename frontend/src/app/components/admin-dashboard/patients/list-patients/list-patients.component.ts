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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'list-patients',
    templateUrl: './list-patients.component.html',
    styleUrls: ['./list-patients.component.scss'],
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        TableModule,
        FloatLabelModule,
        DropdownModule,
        PaginatorModule,
        CommonModule,
        DataViewModule,
        ScrollPanelModule,
        BadgeModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule
    ],
    providers: [PatientService, MessageService]
})
export class ListPatientsComponent implements OnInit {
    // Opções de status para o filtro
    statusOptions: { label: string, value: boolean | null }[] = [
        { label: 'All', value: null },
        { label: 'Active', value: true },
        { label: 'Deactivated', value: false }
    ];

    patients: any[] = [];
    filteredPatients: any[] = [];

    // Filtros
    idFilter: string = '';
    nameFilter: string = '';
    phoneNumberFilter: string = '';
    birthDateFilter: string = '';
    emailFilter: string = '';
    statusFilter: boolean | null = null;

    medicalHistoryDialogVisible: boolean = false;
    selectedMedicalHistory: string = '';

    constructor(private patientService: PatientService, private messageService: MessageService) {}

    ngOnInit(): void {
        this.loadPatients();
    }

    // Carrega os pacientes com base nos filtros aplicados
    loadPatients(): void {
        this.patientService
            .searchPatients(
                this.idFilter,
                this.nameFilter,
                this.phoneNumberFilter,
                this.birthDateFilter,
                this.emailFilter,
                this.statusFilter
            )
            .subscribe(
                (patients) => {
                    this.patients = patients;
                    this.filteredPatients = patients;
                },
                (error) => {
                    console.error('Error loading patients:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load patients' });
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
