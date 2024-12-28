import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateOperationTypesComponent } from './operationTypes/create-operation-types/create-operation-types.component';
import { CreateStaffsComponent } from './staffs/create-staffs/create-staffs.component';
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
import { CreateSpecializationsComponent } from './specialization/create-specializations/create-specializations.component';
import { ListSpecializationsComponent } from './specialization/list-specializations/list-specializations.component';
import { CreateAllergiesComponent } from './allergies/create-allergies/create-allergies.component';
import { ListAllergiesComponent } from './allergies/list-allergies/list-allergies.component';
import { CreateMedicalConditionsComponent } from './medicalConditions/create-medical-conditions/create-medical-conditions.component';
import { ListMedicalConditionsComponent } from './medicalConditions/list-medical-conditions/list-medical-conditions.component';
import { CreateRoomTypesComponent } from './roomTypes/create-room-types/create-room-types.component';
import { CreateSurgeryRoomsComponent } from './surgeryRooms/create-surgery-rooms/create-surgery-rooms.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CreateOperationTypesComponent,
    CreateStaffsComponent,
    CreatePatientsComponent, 
    ListPatientsComponent, 
    MenubarComponent,
    ProfileMenuComponent,
    ListOperationTypesComponent,
    ListStaffsComponent,
    HospitalModelComponent,
    CreateSpecializationsComponent,
    ListSpecializationsComponent,
    ListAllergiesComponent, 
    CreateAllergiesComponent,
    CreateMedicalConditionsComponent,
    ListMedicalConditionsComponent,
    CreateRoomTypesComponent,
    CreateSurgeryRoomsComponent
  ],
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
  showSpecializationList: boolean = false;
  showAllergiesList: boolean = false;
  showMedicalConditionsList: boolean = false; 


  @ViewChild(CreateOperationTypesComponent) createOperationTypesComponent!: CreateOperationTypesComponent;
  @ViewChild(CreateStaffsComponent) createStaffsComponent!: CreateStaffsComponent;
  @ViewChild(ListStaffsComponent) listStaffsComponent!: ListStaffsComponent;
  @ViewChild(ListOperationTypesComponent) listOperationTypesComponent !: ListOperationTypesComponent;
  @ViewChild(CreatePatientsComponent) createPatientsComponent!: CreatePatientsComponent;
  @ViewChild(ListPatientsComponent) listPatientsComponent!: ListPatientsComponent;
  @ViewChild(ProfileMenuComponent) ProfileMenuComponent!: ProfileMenuComponent;
  @ViewChild(HospitalModelComponent) hospitalModelComponent!: HospitalModelComponent;
  @ViewChild(CreateSpecializationsComponent) createSpecializationsComponent!: CreateSpecializationsComponent;
  @ViewChild(CreateAllergiesComponent) createAllergyComponent!: CreateAllergiesComponent;
  @ViewChild(ListAllergiesComponent) listAllergiesComponent!: ListAllergiesComponent;
  @ViewChild(CreateMedicalConditionsComponent) createMedicalConditionsComponent!: CreateMedicalConditionsComponent;
  @ViewChild(ListMedicalConditionsComponent) listMedicalConditionsComponent!: ListMedicalConditionsComponent;
  @ViewChild(CreateRoomTypesComponent) createRoomTypesComponent!: CreateRoomTypesComponent;
  @ViewChild(CreateSurgeryRoomsComponent) createSurgeryRoomsComponent!: CreateSurgeryRoomsComponent;


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
        this.showSpecializationList=false;
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
              this.showSpecializationList = false;
              this.showAllergiesList = false;
              this.showMedicalConditionsList = false;
            }          
          }
        ]
      },
      
      {
        label: 'Specializations',
        icon: '',
        items: [
          {
            label: 'Create Specialization',
            icon: 'pi pi-check',
            command: () => this.createSpecialization()
          },
          {
            label: 'List Specializations',
            icon: 'pi pi-list',
            command: () => {
              this.showSpecializationList = true;
              this.showOperationTypesList = false;
              this.showStaffsList = false;
              this.showPatientsList = false;
              this.showAllergiesList = false;
              this.showMedicalConditionsList = false;
            }          
          }
        ]
      },
      {
        label: 'Allergies',
        icon: '',
        items: [
          {
            label: 'Create Allergy',
            icon: 'pi pi-check',
            command: () => this.createAllergy()
          },
          {
            label: 'List Allergies',
            icon: 'pi pi-list',
            command: () => {
              this.showAllergiesList = true;
              this.showOperationTypesList = false;
              this.showStaffsList = false;
              this.showPatientsList = false;
              this.showMedicalConditionsList = false;
            }          
          }
        ]
      },
      
      {
        label: 'Medical Conditions',
        icon: '',
        items: [
          {
            label: 'Create Medical Conditions',
            icon: 'pi pi-check',
            command: () => this.createMedicalConditions()
          },
          {
            label: 'List Medical Conditions',
            icon: 'pi pi-list',
            command: () => {
              this.showSpecializationList = false;
              this.showOperationTypesList = false;
              this.showStaffsList = false;
              this.showPatientsList = false;
              this.showMedicalConditionsList = true;
              this.showAllergiesList = false;
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
              this.showSpecializationList = false;
              this.showAllergiesList = false;
              this.showMedicalConditionsList = false;
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
              this.showSpecializationList = false;
              this.showAllergiesList = false;
              this.showMedicalConditionsList = false;
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
        label: 'Appointments',
        icon: 'pi pi-calendar-clock',
        items: [
          {
            label: 'GenerateSchedule',
          },
        ]
      },
      {
        label: 'Room Types',
        icon: '',
        items: [
          {
            label: 'Create Room Type',
            icon: 'pi pi-check',
            command: () => this.createRoomType()
          },
        ]
      },
      {
        label: 'Surgery Rooms',
        icon: '',
        items: [
          {
            label: 'Create Surgery Room',
            icon: 'pi pi-check',
            command: () => this.createSurgeryRoom()
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


  createAllergy(){
    this.createAllergyComponent.showDialog();
  }
  
  createOperationType() {
    this.createOperationTypesComponent.showDialog(); 
  }

  createSpecialization() {
    this.createSpecializationsComponent.showDialog(); 
  }

  listOperationTypes() {
    this.showOperationTypesList = true;
  }

  createStaffs() {
    this.createStaffsComponent.showDialog(); 
  }

  createMedicalConditions() {
    this.createMedicalConditionsComponent.showDialog(); 
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

  createRoomType() {
    this.createRoomTypesComponent.showDialog(); 
  }

  createSurgeryRoom() {
    this.createSurgeryRoomsComponent.showDialog(); 
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
