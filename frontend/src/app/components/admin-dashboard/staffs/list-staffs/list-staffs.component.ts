import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../../../services/staff.service';
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
import { Specialization } from '../../../../domain/staff-model';  
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'list-staffs',
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
    ToastModule
  ],
  templateUrl: './list-staffs.component.html',
  styleUrls: ['./list-staffs.component.scss'],
  providers:[MessageService]
})

export class ListStaffsComponent implements OnInit {
  statusOptions: { label: string, value: boolean }[] = [
    { label: 'Active', value: true },
    { label: 'Deactivated', value: false }
  ];
  
  staffs: any[] = [];  
  specializationsMap: { [key: string]: string } = {};  
  specializationsOptions: { label: string, value: string }[] = [];  
  nameFilter: string = '';
  phoneNumberFilter: string = '';
  emailFilter: string = '';
  statusFilter: boolean = true;  
  specializationFilter: string = '';  

  slotsDialogVisible: boolean = false; 

    slots: any[] = [];
    day: Date | null = null;
    startHour: Date | null = null;
    endHour: Date | null = null;
    idStaff: string = "";

    editDialogVisible: boolean = false;
    selectedStaff: any = {}; 

  constructor(private staffService: StaffService, private router: Router, private messageService : MessageService) {}

  ngOnInit(): void {
    this.loadStaffs();  
  }

  loadStaffs() {
    const statusBoolean = this.statusFilter;
    this.staffService.searchStaffs(this.nameFilter, this.phoneNumberFilter, this.emailFilter, this.specializationFilter, statusBoolean).subscribe(
        (staffs) => {
            console.log(staffs);
            this.staffs = staffs;
            this.loadSpecializations();    
        },
        (error) => console.error('Error loading staffs', error)
    );
  }

  loadSpecializations(): void {
    const uniqueSpecializationIds = Array.from(new Set(this.staffs.map(staff => staff.specializationId)));

    uniqueSpecializationIds.forEach(specializationId => {
        this.staffService.getSpecializationById(specializationId).subscribe(
            (specializationData) => {
                this.specializationsMap[specializationId] = specializationData.specializationName;
                this.specializationsOptions.push({
                  label: specializationData.specializationName,
                  value: specializationId
                });
            },
            (error) => console.error('Error loading specialization', error)
        );
    });
}


loadSlots(staffId: string) {
  this.staffService.getAvailabilitySlots(staffId).subscribe(
      (availabilitySlot) => {
          this.slots = availabilitySlot;
      },
      (error) => console.error('Error loading staffs', error)
  );
}

  getSpecializationName(specializationId: string): string {
    return this.specializationsMap[specializationId] || 'Not specified';  
  }

  showSlots(staffId: string) {
    this.idStaff = staffId;
    this.loadSlots(staffId);
    this.slotsDialogVisible = true;
  }


  addSlot() {
    if (this.day && this.startHour && this.endHour) {
      const startDate = new Date(this.day);
      const startHour = this.startHour.getHours();
      const startMinute = this.startHour.getMinutes();
      startDate.setHours(startHour, startMinute, 0, 0);
  
      const endDate = new Date(this.day);
      const endHour = this.endHour.getHours();
      const endMinute = this.endHour.getMinutes();
      endDate.setHours(endHour, endMinute, 0, 0);
  
      if (startDate >= endDate) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Start time must be before end time.',
        });
        return;
      }
  
      const isOverlapping = this.slots.some(slot => {
        return startDate < new Date(slot.end) && endDate > new Date(slot.start);
      });
  
      if (isOverlapping) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'The time slot overlaps with another slot.',
        });
        return;
      }
  
      const newSlot = {
        staffId: this.idStaff,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };
  
      this.staffService.addAvailabilitySlot(this.idStaff, newSlot).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Availability slot added successfully!',
          });
          this.slots.push(newSlot);
        },
        error: (error) => {
          console.error('Failed to update availability slots:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update availability slots.',
          });
        },
      });
  
      this.day = null;
      this.startHour = null;
      this.endHour = null;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a day, start time, and end time.',
      });
    }
  }
  



  removeSlot(slot: { start: string, end: string }) {
    if (confirm('Are you sure you want to remove this availability slot?')) {
      this.staffService.removeAvailabilitySlot(this.idStaff, slot).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Availability slot removed successfully!',
          });
          this.slots = this.slots.filter(
            s => s.start !== slot.start || s.end !== slot.end
          );
        },
        error: (error) => {
          console.error('Failed to remove availability slot:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove availability slot.',
          });
        },
      });
    }
  }

  preventDefault(event: Event): void {
    event.preventDefault();
  }
  

  onSearch(): void {
    this.specializationsOptions = [];  
    this.loadStaffs();  
  }

   openEditDialog(item: any) {
    this.selectedStaff = { ...item };
    this.editDialogVisible = true;
  }

  saveStaffInfo(selectedStaff: any) {
  
    console.log('Saving staff info', this.selectedStaff);
    this.staffService.updateStaff(this.selectedStaff);
    this.editDialogVisible = false;
  }

}
