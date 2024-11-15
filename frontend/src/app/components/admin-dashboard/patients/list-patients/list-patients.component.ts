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
  statusOptions: { label: string, value: boolean }[] = [
      { label: 'Active', value: true },
      { label: 'Deactivated', value: false }
  ];

  patients: any[] = [];
  filteredPatients: any[] = [];
  
  nameFilter: string = '';
  birthDateFilter: string = '';
  statusFilter: boolean = true;

  medicalHistoryDialogVisible: boolean = false;
  selectedMedicalHistory: string = '';

  constructor(private patientService: PatientService, private messageService: MessageService) {}

  ngOnInit(): void {
      this.loadPatients();
  }

  loadPatients(): void {
      this.patientService.searchPatients(this.nameFilter, this.birthDateFilter, this.statusFilter).subscribe(
          (patients) => {
              this.patients = patients;
              this.filteredPatients = patients;
          },
          (error) => {
              console.error('Error loading patients:', error);
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to load patients'});
          }
      );
  }

  showMedicalHistory(medicalHistory: string) {
      this.selectedMedicalHistory = medicalHistory;
      this.medicalHistoryDialogVisible = true;
  }

  // Método de busca acionado ao clicar no botão ou alterar filtros
  onSearch(): void {
      this.loadPatients();
  }
}