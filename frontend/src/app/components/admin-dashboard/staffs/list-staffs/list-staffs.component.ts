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
    FloatLabelModule
  ],
  templateUrl: './list-staffs.component.html',
  styleUrls: ['./list-staffs.component.scss']
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

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaffs();  
  }

  loadStaffs() {
    const statusBoolean = this.statusFilter;
    this.staffService.searchStaffs(this.nameFilter, this.phoneNumberFilter, this.emailFilter, this.specializationFilter, statusBoolean).subscribe(
        (staffs) => {
            this.staffs = staffs;
            this.loadSpecializations(); 
        },
        (error) => console.error('Error loading staffs', error)
    );
  }


loadSpecializations(): void {
    const specializationIds: Set<string> = new Set();
    
    this.staffs.forEach(item => {
      item.specializations.forEach((specialization: Specialization) => { 
        if (!specializationIds.has(specialization.id)) {
          specializationIds.add(specialization.id);
          
          this.staffService.getSpecializationById(specialization.id).subscribe(
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
    this.loadStaffs();  
  }
}
