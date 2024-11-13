import { Component, OnInit } from '@angular/core';
import { OperationTypeService } from '../../../../../services/operation-type-service.service';
import { Specialization } from '../../../../../domain/operationType-model';  // Ajuste o caminho conforme necessário
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';  
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'list-operation-types',
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
    FloatLabelModule
  ],
  templateUrl: './list-operation-types.component.html',
  styleUrls: ['./list-operation-types.component.scss']
})
export class ListOperationTypesComponent implements OnInit {
  statusOptions: { label: string, value: boolean }[] = [
    { label: 'Active', value: true },
    { label: 'Deactivated', value: false }
  ];
  
  operationTypes: any[] = [];  // Lista de tipos de operação
  specializationsMap: { [key: string]: string } = {};  // Mapeamento de especializações
  specializationsOptions: { label: string, value: string }[] = [];  // Opções para o dropdown
  nameFilter: string = '';
  statusFilter: boolean = true;  // Status inicial
  specializationFilter: string = '';  // ID de especialização

  constructor(private operationTypeService: OperationTypeService) {}

  ngOnInit(): void {
    this.loadOperationTypes();  // Carrega os dados ao inicializar
  }

  loadOperationTypes(): void {
    const statusBoolean = this.statusFilter;
    this.operationTypeService.searchOperationTypes(this.nameFilter, this.specializationFilter, statusBoolean).subscribe(
      (operationTypes) => {
        this.operationTypes = operationTypes;
        this.loadSpecializations();  
      },
      (error) => console.error('Error loading operation types', error)
    );
  }

  loadSpecializations(): void {
    this.operationTypes.forEach(item => {
      item.specializations.forEach((specialization: Specialization) => { 
        this.operationTypeService.getSpecializationById(specialization.id).subscribe(
          (specializationData) => {
            this.specializationsMap[specialization.id] = specializationData.specializationName; 
          },
          (error) => console.error('Error loading specialization', error)
        );
      })
    });
  };

  getSpecializations(): void {
    this.specializationsMap = {};
    
    this.operationTypes.forEach(item => {
      item.specializations.forEach((specialization: Specialization) => { 
        if (!this.specializationsMap[specialization.id]) {
          this.operationTypeService.getSpecializationById(specialization.id).subscribe(
            (specializationData) => {
              this.specializationsMap[specialization.id] = specializationData.specializationName;
            },
            (error) => console.error('Error loading specialization', error)
          );
        }
      });
    });
  }

  getSpecializationName(specializationId: string): string {
    return this.specializationsMap[specializationId] || 'Not specified';  
  }

  onSearch(): void {
    this.loadOperationTypes();  
  }
}
