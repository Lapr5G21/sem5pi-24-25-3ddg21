import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem, MessageService } from 'primeng/api';
import { CreateOperationRequestsComponent } from './operationRequests/create-operation-requests/create-operation-requests.component';
import { ListOperationRequestsComponent } from './operationRequests/list-operation-requests/list-operation-requests.component';
import { ListMedicalRecordComponent } from './medicalRecord/list-medical-record/list-medical-record.component';
import { CommonModule } from '@angular/common';
import { HospitalModelComponent } from '../hospital-model/hospital-model/hospital-model.component';
import { ProfileMenuComponent } from '../admin-dashboard/profile-menu-component/profile-menu-component.component';
import { CreateMedicalRecordComponent } from './medicalRecord/create-medical-record/create-medical-record.component';
import { ListPatientsComponent } from './patients/list-patients/list-patients.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarComponent,
    CreateMedicalRecordComponent,
    CreateOperationRequestsComponent,
    ListOperationRequestsComponent,
    ListMedicalRecordComponent,
    CommonModule,
    HospitalModelComponent,
    ProfileMenuComponent,
    ListPatientsComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
  providers: [MessageService]
})
export class DoctorDashboardComponent implements OnInit {
  
  items: MenuItem[] = [];
  showOperationRequestsList: boolean = false;
  showHospitalModel: boolean = false;
  showMedicalRecordsList: boolean = false;
  showPatientsList: boolean = false;


  @ViewChild(CreateOperationRequestsComponent) createOperationRequestsComponent!: CreateOperationRequestsComponent;
  @ViewChild(CreateMedicalRecordComponent) createMedicalRecordComponent!: CreateMedicalRecordComponent;
  @ViewChild(ListOperationRequestsComponent) listOperationRequestsComponent!: ListOperationRequestsComponent;
  @ViewChild(ListMedicalRecordComponent) listMedicalRecordComponent!: ListMedicalRecordComponent;
  @ViewChild(ListPatientsComponent) listPatientsComponent!: ListPatientsComponent;
  @ViewChild(HospitalModelComponent) hospitalModelComponent!: HospitalModelComponent
  @ViewChild(ProfileMenuComponent) profileMenuComponent!: ProfileMenuComponent
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.goHome()
      },
      {
        label: 'Medical Records',
        icon: 'pi pi-file',
        items:[
          {
            label: 'Create Medical Record',
            icon: 'pi pi-check',
            command: () => this.createMedicalRecord()
          },
          {
            label: 'Search/List',
            icon: 'pi pi-list',
            command: () => this.listMedicalRecords() 
          } 
        ]
      },
      {
        label: 'Patients',
        icon: 'pi pi-file',
        items:[
          {
            label: 'Search/List',
            icon: 'pi pi-list',
            command: () => this.listPatients() 
          } 
        ]
      },
      {
        label: 'Operation Requests',
        icon: '',
        items: [
          {
            label: 'Create Request',
            icon: 'pi pi-check',
            command: () => this.createOperationRequest()
          },
          {
            label: 'Search/List',
            icon: 'pi pi-list',
            command: () => this.listOperationRequests()
          }
        ]
      },
      {
        label: '3D Visualization',
        icon: '',
        items: [
          {
            label: 'Watch',
            icon: 'pi pi-check',
            command: () => this.showHospitalModelComponent()
          },
        ]
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Ver Perfil',
            command: () => {
              this.openProfileDialog()
            }
          },
          {
            label: 'Logout',
            command: () => this.logout()
          }
        ]
      }
    ];
  }

  goHome() {
    this.showOperationRequestsList = false; 
    this.showHospitalModel = false;
    this.showMedicalRecordsList = false;
    this.showPatientsList = false;
    this.router.navigate(['/doctorDashboard/home']); 
  }

  createMedicalRecord() {
    this.createMedicalRecordComponent.showDialog();
  }

  createOperationRequest() {
    this.createOperationRequestsComponent.showDialog();
  }

  listMedicalRecords() {
    this.showMedicalRecordsList = true;
    this.showOperationRequestsList = false;
    this.showPatientsList = false;
  }

  listOperationRequests() {
    this.showOperationRequestsList = true;
    this.showMedicalRecordsList = false;
    this.showPatientsList = false;
    this.listOperationRequestsComponent.loadOperationRequests();
  }

  listPatients() {
    this.showMedicalRecordsList = false;
    this.showOperationRequestsList = false;
    this.showPatientsList = true;
  }

  showHospitalModelComponent() {
    this.router.navigate(['doctorDashboard/3DModule']);
  }
  logout() {
    this.profileMenuComponent.logout();
  }

  openProfileDialog() {
    console.log("Clicou em Profile");
    if (this.profileMenuComponent) {
      console.log("Abrindo o diálogo de perfil...");
      this.profileMenuComponent.openProfileDialog();
    } else {
      console.log("Componente ProfileMenu não está disponível");
    }
  }
}
