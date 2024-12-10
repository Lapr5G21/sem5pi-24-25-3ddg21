import { Component, OnInit } from '@angular/core';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
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
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'list-medical-conditions',
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
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  templateUrl: './list-medical-conditions.component.html',
  styleUrl: './list-medical-conditions.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class ListMedicalConditionsComponent implements OnInit {
  nameFilter: string = '';
  codeFilter: string = '';

  medicalConditions: any[] = [];

  editDialogVisible: boolean = false;
  selectedMedicalCondition: any = {}; 

  constructor(private medicalConditionService: MedicalConditionService, private router: Router, private messageService : MessageService,  private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadMedicalConditions();  
  }

  loadMedicalConditions() {
    
    this.medicalConditionService.searchMedicalConditions(this.nameFilter, this.codeFilter).subscribe(
        (medicalConditions) => {
            console.log(medicalConditions);
            this.medicalConditions = medicalConditions;   
        },
        (error) => console.error('Error loading medical conditions', error)
    );
  }

  onSearch(): void { 
    this.loadMedicalConditions();  
  }

  openEditDialog(item: any) {
    this.selectedMedicalCondition = { ...item };
    this.editDialogVisible = true;
    
  }

  saveMedicalConditionInfo(selectedMedicalCondition: any) {
    console.log('Saving medical condition info:', selectedMedicalCondition);
    
    this.medicalConditionService.updateMedicalCondition(selectedMedicalCondition.id, selectedMedicalCondition).subscribe({
      next: (response) => {
        console.log('Medical condition info atualizado com sucesso:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Medical condition information updated successfully!',
        });
        
        this.editDialogVisible = false; 
      },
      error: (error) => {
        console.error('Erro ao atualizar medical condition info:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update medical condition information.',
        });
      },
      complete: () => {
        console.log('Processo de atualização de medical condition concluído.');
        this.loadMedicalConditions();
      }
    });
  }
  
}
