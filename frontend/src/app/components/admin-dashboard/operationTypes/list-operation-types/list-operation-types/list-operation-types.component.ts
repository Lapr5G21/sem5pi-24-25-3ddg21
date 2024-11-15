import { Component, OnInit } from '@angular/core';
import { OperationTypeService } from '../../../../../services/operation-type-service.service';
import { Specialization } from '../../../../../domain/operationType-model';  
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


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
    FloatLabelModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './list-operation-types.component.html',
  styleUrls: ['./list-operation-types.component.scss']
})
export class ListOperationTypesComponent implements OnInit {
  statusOptions: { label: string, value: boolean }[] = [
    { label: 'Active', value: true },
    { label: 'Deactivated', value: false }
  ];
  
  operationTypes: any[] = [];  
  specializationsMap: { [key: string]: string } = {};  
  specializationsOptions: { label: string, value: string }[] = [];  
  nameFilter: string = '';
  statusFilter: boolean = true;  
  specializationFilter: string = '';  

  constructor(private operationTypeService: OperationTypeService,
              private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadOperationTypes();  
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
    const specializationIds: Set<string> = new Set();
    
    this.operationTypes.forEach(item => {
      item.specializations.forEach((specialization: Specialization) => { 
        if (!specializationIds.has(specialization.id)) {
          specializationIds.add(specialization.id);
          
          this.operationTypeService.getSpecializationById(specialization.id).subscribe(
            (specializationData) => {
              this.specializationsMap[specialization.id] = specializationData.specializationName; 
              this.specializationsOptions.push({
                label: specializationData.specializationName,
                value: specialization.id
              });
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
    this.specializationsOptions = [];  
    this.loadOperationTypes();  
  }

  onDisable(operationTypeId: string): void {
    this.operationTypeService.disableOperationType(operationTypeId).subscribe(
      () => {
        
        const operationType = this.operationTypes.find(op => op.id === operationTypeId);
        if (operationType) {
          operationType.isActive = false;
        }
      },
      (error) => console.error('Erro ao desativar o tipo de operação', error)
    );
  }

  confirmDisable(operationTypeId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this operation type?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDisable(operationTypeId);
      },
      reject: () => {
        console.log('Operation type disable action canceled.');
      }
    });
  }

  
}
