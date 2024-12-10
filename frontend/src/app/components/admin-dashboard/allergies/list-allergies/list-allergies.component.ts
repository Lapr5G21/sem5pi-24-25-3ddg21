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

@Component({
  selector: 'app-list-allergies',
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
    ToastModule],
  templateUrl: './list-allergies.component.html',
  styleUrl: './list-allergies.component.scss'
})
export class ListAllergiesComponent implements OnInit {
  editDialogVisible: boolean = false;
  allergies: Allergy[] = [];

  selectedAllergy: Allergy = {
    name: '',
    code: '',
    description: ''
  };

  constructor(private allergyService: AllergyService,
              private confirmationService: ConfirmationService, private messageService : MessageService) {}

  ngOnInit(): void {
    this.loadAllergies();
  }

  loadAllergies(): void {
    this.allergyService.getAllergies().subscribe(
      (allergies) => {
        this.allergies = allergies;
      },
      (error) => console.error('Error loading allergies', error)
    );
  }

  onSearch(): void {
    this.loadAllergies();
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

