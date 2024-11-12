import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateOperationTypesComponent } from './operationTypes/create-operation-types/create-operation-types.component';
import { CreateStaffsComponent } from './staffs/create-staffs/create-staffs.component';
import { EditStaffsComponent } from './staffs/edit-staffs/edit-staffs.component';
import { CreatePatientsComponent } from './patients/create-patients/create-patients.component';
import { MenuItem } from 'primeng/api';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from './profile-menu-component/profile-menu-component.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, CreateOperationTypesComponent, CreateStaffsComponent, EditStaffsComponent, CreatePatientsComponent, MenubarComponent,ProfileMenuComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  items: MenuItem[] = [];
  showProfileDialog: boolean = false;

  @ViewChild(CreateOperationTypesComponent) createOperationTypesComponent!: CreateOperationTypesComponent;
  @ViewChild(CreateStaffsComponent) createStaffsComponent!: CreateStaffsComponent;
  @ViewChild(EditStaffsComponent) editStaffsComponent!: EditStaffsComponent;
  @ViewChild(CreatePatientsComponent) createPatientsComponent!: CreatePatientsComponent;
  @ViewChild(ProfileMenuComponent) ProfileMenuComponent!: ProfileMenuComponent;

  constructor() {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'OperationTypes',
        icon: '',
        items: [
          {
            label: 'Create',
            icon: 'pi pi-check',
            command: () => this.createOperationType()
           // command: () => this.router.navigate(['/operationR'])
          },
          {
            label: 'Edit',
            icon: 'pi pi-pencil'
          },
          {
            label: 'List',
            icon: 'pi pi-list'
          }
        ]
      },
      {
        label: 'Staffs',
        icon: '',
        items: [
          {
            label: 'Create',
            icon: 'pi pi-check',
            command: () => this.createStaffs()
           // command: () => this.router.navigate(['/operationR'])
          },
          {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => this.editStaffs()
          },
          {
            label: 'List',
            icon: 'pi pi-list'
          }
        ]
      },
      {
        label: 'Patients',
        icon: '',
        items: [
          {
            label: 'Create',
            icon: 'pi pi-check',
            command: () => this.createPatient()
           // command: () => this.router.navigate(['/patients'])
          }
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

  createStaffs() {
    this.createStaffsComponent.showDialog(); 
  }

  editStaffs() {
    this.editStaffsComponent.showDialog(); 
  }

  createPatient() {
    this.createPatientsComponent.showDialog(); 
  }

  logout() {
    this.ProfileMenuComponent.logout();
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
