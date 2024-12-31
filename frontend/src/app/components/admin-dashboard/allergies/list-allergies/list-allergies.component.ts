import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllergyService } from '../../../../services/allergy.service';
import { Allergy } from '../../../../domain/allergy-model';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'list-allergies',
  standalone: true,
  imports: [TableModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    BadgeModule,
    ScrollPanelModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    FloatLabelModule,
    ConfirmDialogModule,
    ToastModule,
    DataViewModule],
  templateUrl: './list-allergies.component.html',
  styleUrl: './list-allergies.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ListAllergiesComponent implements OnInit {
  editDialogVisible: boolean = false;
  allergies: Allergy[] = [];
  filteredAllergies: Allergy[] = [];

  nameFilter: string = '';
  codeFilter: string = '';

  selectedAllergy: any = {};

  constructor(private allergyService: AllergyService,
              private confirmationService: ConfirmationService, private messageService : MessageService) {}

  ngOnInit(): void {
    this.loadAllergies();
  }

  loadAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (allergies) => {
        this.allergies = allergies;
        this.filteredAllergies = [...this.allergies];
      },
      (error) => console.error('Error loading allergies', error)
    );
  }

  onSearch(): void {
    this.filteredAllergies = this.allergies.filter(item => {
      const matchesName = this.nameFilter
        ? item.name.toLowerCase().startsWith(this.nameFilter.toLowerCase())
        : true;
      const matchesCode = this.codeFilter
        ? item.code.toLowerCase().startsWith(this.codeFilter.toLowerCase())
        : true;
  
      return matchesName && matchesCode;
    });
  
    if (this.filteredAllergies.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Results',
        detail: 'No allergies found matching the criteria.',
      });
    }
  }

  onRemove(allergyCode: string): void {
    this.allergyService.removeAllergy(allergyCode).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Allergy deleted successfully!'
        });
        this.refreshAllergies(); 
      },
      (error) => {
        console.error('Error deleting Allergy:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete Allergy.'
        });
      }
  )}


  openEditDialog(item: any) {
    this.selectedAllergy = { ...item };
    this.editDialogVisible = true;
    
  }
  saveAllergyInfo(selectedAllergy: Allergy) {
      console.log('Saving allergy info:', selectedAllergy);
      
      this.allergyService.updateAllergy(selectedAllergy.id, selectedAllergy).subscribe({
        next: (response) => {
          console.log('Saving allergy info updated successfully:', response);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Saving allergy info updated successfully!',
          });
          
          this.editDialogVisible = false; 
        },
        error: (error) => {
          console.error('Failed to update allergy info:', error);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update allergy info.',
          });
        },
        complete: () => {
          console.log('Update allergy proccess complete.');
          this.loadAllergies();
        }
      });
    }

  confirmRemove(allergyCode: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this allergy?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove(allergyCode);
      },
      reject: () => {
        console.log('Allergy deletition action canceled.');
      }
    });
  }

  refreshAllergies() {
    this.allergyService.getAllergies().subscribe(
      (allergies) => {
        this.allergies = allergies;
      },
      (error) => console.error('Error loading allergies', error)
    );
  }

  adjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  

}

