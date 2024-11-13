import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PatientService } from '../../../../services/patient.service';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'list-patients-modal',
  standalone: true,
  imports: [TableModule,DialogModule,AccordionModule,DataViewModule,ButtonModule,CommonModule],
  templateUrl: './list-patients.component.html',
  styleUrl: './list-patients.component.scss'
})
export class ListPatientsComponent implements OnInit {
  patients: any[] = []; 

  constructor(private patientService: PatientService) {}

  visible: boolean = false;

  loadPatients() {
    this.patientService.getPatients().subscribe(
      (patients) => {
        console.log('patients:', patients);
        this.patients = patients; 
      },
      (error) => console.error('Error loading patients', error)
    );
  }

  ngOnInit(): void {
    this.loadPatients(); 
  }

  showDialog() {
    this.visible = true;
  }
}
