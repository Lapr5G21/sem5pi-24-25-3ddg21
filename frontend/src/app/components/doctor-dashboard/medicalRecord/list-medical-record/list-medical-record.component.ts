import { Component, OnInit } from '@angular/core';
import { MedicalRecordService } from '../../../../services/medical-record-service';
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
import { MedicalRecord } from '../../../../domain/medical-record-model';


@Component({
  selector: 'list-medical-record',
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
  templateUrl: './list-medical-record.component.html',
  styleUrl: './list-medical-record.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class ListMedicalRecordComponent implements OnInit {
  nameFilter: string = '';
  codeFilter: string = '';

  medicalRecords: MedicalRecord[] = [];

  editDialogVisible: boolean = false;
  selectedMedicalRecord: any = {}; 
  filteredMedicalRecords: MedicalRecord[] = [];

  allergies: any[] = [];
  allergiesDialogVisible: boolean = false; 

  constructor(private medicalRecordService: MedicalRecordService, private messageService : MessageService,  private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();  
  }

  loadMedicalRecords(): void {
    
    this.medicalRecordService.getMedicalRecords().subscribe(
        (medicalRecords) => {
            this.medicalRecords = medicalRecords;   
            this.filteredMedicalRecords = [...this.medicalRecords];
        },
        (error) => console.error('Error loading medical records', error)
    );
  }


  onSearch(): void {
    // this.filteredMedicalRecords = this.medicalRecords.filter(item => {
    //   const matchesName = this.nameFilter
    //     ? item.name.toLowerCase().startsWith(this.nameFilter.toLowerCase())
    //     : true;
    //   const matchesCode = this.codeFilter
    //     ? item.code.toLowerCase().startsWith(this.codeFilter.toLowerCase())
    //     : true;
  
    //   return matchesName && matchesCode;
    // });
  
    // if (this.filteredMedicalConditions.length === 0) {
    //   this.messageService.add({
    //     severity: 'info',
    //     summary: 'No Results',
    //     detail: 'No medical conditions found matching the criteria.',
    //   });
    // }
  }
  
  openEditDialog(item: any) {
    this.selectedMedicalRecord = { ...item };
    this.editDialogVisible = true;
    
  }

   saveMedicalRecordInfo(selectedMedicalRecord: MedicalRecord) {
      console.log('Saving medical record info:', selectedMedicalRecord);
      
      this.medicalRecordService.updateMedicalRecord(selectedMedicalRecord.id, selectedMedicalRecord).subscribe({
        next: (response) => {
          console.log('Medical record info updated successfully:', response);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Medical record information updated successfully!',
          });
          
          this.editDialogVisible = false; 
        },
        error: (error) => {
          console.error('Failed to update medical record info:', error);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update medical record information.',
          });
        },
        complete: () => {
          console.log('Update medical record proccess complete.');
          this.loadMedicalRecords();
        }
      });
    }
}
