import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Specialization } from '../../../../domain/operationType-model';
import { SpecializationsService } from '../../../../services/specializations-service.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'list-specializations',
  standalone: true,
  imports: [
    TableModule,
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
    ToastModule
  ],
  providers: [ConfirmationService,MessageService],
  templateUrl: './list-specializations.component.html',
  styleUrls: ['./list-specializations.component.scss']
})
export class ListSpecializationsComponent implements OnInit {
  editDialogVisible: boolean = false;
  specializations: Specialization[] = [];
  filterName: string = '';
  filterCode: string = '';
  filterDescription: string = '';

  selectedSpecialization: Specialization = {
    id: '',
    specializationName: '',
    specializationCode: '',
    specializationDescription: ''
  };

  constructor(private specializationService: SpecializationsService,
              private confirmationService: ConfirmationService, private messageService : MessageService) {}

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.specializationService.searchSpecializations(this.filterName,this.filterCode,this.filterDescription).subscribe(
      (specializations) => {
        this.specializations = specializations;
      },
      (error) => console.error('Error loading specializations', error)
    );
  }

  onSearch(): void {
    this.loadSpecializations();
  }

  onRemove(specializationId: string): void {
    this.specializationService.removeSpecialization(specializationId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Specialization deleted successfully!'
        });
        this.refreshSpecializations(); 
      },
      (error) => {
        console.error('Error deleting specialization:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete specialization.'
        });
      }
  )}

  confirmRemove(specializationId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this specialization?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove(specializationId);
      },
      reject: () => {
        console.log('Specialization disable action canceled.');
      }
    });
  }

  onEdit(specialization: Specialization): void {
    this.selectedSpecialization = { ...specialization };
    this.editDialogVisible = true;
  }

  saveSpecializationInfo(selectedSpecialization: Specialization) {

    this.specializationService.updateSpecialization(selectedSpecialization).subscribe(
      () => {
        this.loadSpecializations();
        this.editDialogVisible = false;
      },
      (error) => console.error('Error saving specialization info', error)
    );
  }

  refreshSpecializations() {
    this.specializationService.getSpecializations().subscribe(
      (specializations) => {
        this.specializations = specializations;
      },
      (error) => console.error('Error loading specializations', error)
    );
  }

  adjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  

}
