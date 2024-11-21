import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateOperationTypesComponent } from './operationTypes/create-operation-types/create-operation-types.component';
import { CreateStaffsComponent } from './staffs/create-staffs/create-staffs.component';
import { EditStaffsComponent } from './staffs/edit-staffs/edit-staffs.component';
import { ListStaffsComponent } from './staffs/list-staffs/list-staffs.component';
import { CreatePatientsComponent } from './patients/create-patients/create-patients.component';
import { ListPatientsComponent } from './patients/list-patients/list-patients.component';
import { MenuItem } from 'primeng/api';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from './profile-menu-component/profile-menu-component.component';
import { ListOperationTypesComponent } from './operationTypes/list-operation-types/list-operation-types/list-operation-types.component';
import { HospitalModelComponent } from '../hospital-model/hospital-model/hospital-model.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule,CreateOperationTypesComponent, CreateStaffsComponent, EditStaffsComponent, CreatePatientsComponent, ListPatientsComponent, MenubarComponent,ProfileMenuComponent,ListOperationTypesComponent,ListStaffsComponent,HospitalModelComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  items: MenuItem[] = [];
  showProfileDialog: boolean = false;
  showOperationTypesList: boolean = false;
  showStaffsList : boolean = false;
  showPatientsList : boolean = false;
  showHospitalModel: boolean = false;

  @ViewChild(CreateOperationTypesComponent) createOperationTypesComponent!: CreateOperationTypesComponent;
  @ViewChild(CreateStaffsComponent) createStaffsComponent!: CreateStaffsComponent;
  @ViewChild(EditStaffsComponent) editStaffsComponent!: EditStaffsComponent;
  @ViewChild(ListStaffsComponent) listStaffsComponent!: ListStaffsComponent;
  @ViewChild(ListOperationTypesComponent) listOperationTypesComponent !: ListOperationTypesComponent;
  @ViewChild(CreatePatientsComponent) createPatientsComponent!: CreatePatientsComponent;
  @ViewChild(ListPatientsComponent) listPatientsComponent!: ListPatientsComponent;
  @ViewChild(ProfileMenuComponent) ProfileMenuComponent!: ProfileMenuComponent;
  @ViewChild(HospitalModelComponent) hospitalModelComponent!: HospitalModelComponent;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.showOperationTypesList=false;
        this.showStaffsList=false;
        this.showPatientsList=false;
        }
      },
      {
        label: 'OperationTypes',
        icon: '',
        items: [
          {
            label: 'Create Operation Type',
            icon: 'pi pi-check',
            command: () => this.createOperationType()
          },
          {
            label: 'List Operation Types',
            icon: 'pi pi-list',
            command: () => {
              this.showOperationTypesList = true;
              this.showStaffsList = false;
              this.showPatientsList = false;
            }          
          }
        ]
      },
      {
        label: 'Staffs',
        icon: '',
        items: [
          {
            label: 'Create Staff',
            icon: 'pi pi-check',
            command: () => this.createStaffs()
          },
          {
            label: 'List Staffs',
            icon: 'pi pi-list',
            command: () => {
              this.showStaffsList = true;
              this.showOperationTypesList=false;
              this.showPatientsList=false;
            }   
          }
        ]
      },
      {
        label: 'Patients',
        icon: '',
        items: [
          {
            label: 'Create Patient',
            icon: 'pi pi-check',
            command: () => this.createPatient()
          },
          {
            label: 'List Patients',
            icon: 'pi pi-list',
            command: () => {
              this.showPatientsList = true;
              this.showOperationTypesList=false;
              this.showStaffsList=false;
            }
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

  createOperationType() {
    this.createOperationTypesComponent.showDialog(); 
  }

  listOperationTypes() {
    this.showOperationTypesList = true;
  }

  createStaffs() {
    this.createStaffsComponent.showDialog(); 
  }

  listStaffs() {
    this.router.navigate(['adminDashboard/staffs/list']);
  }

  createPatient() {
    this.createPatientsComponent.showDialog(); 
  }

  listPatients() {
    this.router.navigate(['adminDashboard/patients/list']);
  }

  logout() {
    this.ProfileMenuComponent.logout();
  }

  showHospitalModelComponent() {
    this.router.navigate(['adminDashboard/3DModule']);
  }
  
  openProfileDialog() {
    console.log("Clicou em Profile");
    if (this.ProfileMenuComponent) {
      console.log("Abrindo o diálogo de perfil...");
      this.ProfileMenuComponent.openProfileDialog();
    } else {
      console.log("Componente ProfileMenu não está disponível");
    }
  }

}
