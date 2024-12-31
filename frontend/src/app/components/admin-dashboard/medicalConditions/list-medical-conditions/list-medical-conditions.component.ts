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
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MedicalCondition } from '../../../../domain/medical-condition-model';


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

  medicalConditions: MedicalCondition[] = [];

  editDialogVisible: boolean = false;
  selectedMedicalCondition: any = {}; 
  filteredMedicalConditions: MedicalCondition[] = [];

  constructor(private medicalConditionService: MedicalConditionService, private messageService : MessageService,  private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadMedicalConditions();  
  }

  loadMedicalConditions(): void {
    
    this.medicalConditionService.getMedicalConditions().subscribe(
        (medicalConditions) => {
            this.medicalConditions = medicalConditions;   
            this.filteredMedicalConditions = [...this.medicalConditions];
        },
        (error) => console.error('Error loading medical conditions', error)
    );
  }

  onSearch(): void {
    if (!this.nameFilter && !this.codeFilter) {
      this.filteredMedicalConditions = [...this.medicalConditions];
    } else {
      this.filteredMedicalConditions = this.medicalConditions.filter(item => {
        const matchesName = item.name.toLowerCase() === this.nameFilter.toLowerCase();
        const matchesCode = item.code.toLowerCase() === this.codeFilter.toLowerCase();
        return matchesName || matchesCode;
      });
    }

    if (this.filteredMedicalConditions.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Results',
        detail: 'No medical conditions found matching the criteria.',
      });
    }
  }

  openEditDialog(item: any) {
    this.selectedMedicalCondition = { ...item };
    this.editDialogVisible = true;
    
  }

  saveMedicalConditionInfo(selectedMedicalCondition: MedicalCondition) {
    console.log('Saving medical condition info:', selectedMedicalCondition);
    
    this.medicalConditionService.updateMedicalCondition(selectedMedicalCondition.id, selectedMedicalCondition).subscribe({
      next: (response) => {
        console.log('Medical condition info updated successfully:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Medical condition information updated successfully!',
        });
        
        this.editDialogVisible = false; 
      },
      error: (error) => {
        console.error('Failed to update medical condition info:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update medical condition information.',
        });
      },
      complete: () => {
        console.log('Update medical condition proccess complete.');
        this.loadMedicalConditions();
      }
    });
  }
  

  onRemove(id: string): void {
    this.medicalConditionService.removeMedicalCondition(id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Medical condition deleted successfully!'
        });
        this.loadMedicalConditions();
      },
      (error) => {
        console.error('Error deleting medical condition:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete medical condition.'
        });
      }
  )}

  confirmRemove(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this medical condition?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove(id);
      },
      reject: () => {
        console.log('Medical condition deletition action canceled.');
      }
    });
  }
}
