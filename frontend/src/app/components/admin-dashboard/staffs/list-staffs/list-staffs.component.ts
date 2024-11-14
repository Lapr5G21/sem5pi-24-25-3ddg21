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
  statusFilter: boolean = true;  
  specializationFilter: string = '';  

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaffs();  
  }

  loadStaffs() {
    const statusBoolean = this.statusFilter;
    this.staffService.searchStaffs(this.nameFilter, this.specializationFilter, statusBoolean).subscribe(
        (staffs) => {
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
            },
            (error) => console.error('Error loading specialization', error)
        );
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
