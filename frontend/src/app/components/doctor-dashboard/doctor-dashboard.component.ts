import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';
import { CreateOperationRequestsComponent } from './operationRequests/create-operation-requests/create-operation-requests.component';
import { ListOperationRequestsComponent } from './operationRequests/list-operation-requests/list-operation-requests.component';
import { CommonModule } from '@angular/common';
import { HospitalModelComponent } from '../hospital-model/hospital-model/hospital-model.component';
import { ProfileMenuComponent } from '../admin-dashboard/profile-menu-component/profile-menu-component.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarComponent,
    CreateOperationRequestsComponent,
    ListOperationRequestsComponent,
    CommonModule,
    HospitalModelComponent,
    ProfileMenuComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  
  items: MenuItem[] = [];
  showOperationRequestsList: boolean = false;
  showHospitalModel: boolean = false;

  @ViewChild(CreateOperationRequestsComponent) createOperationRequestsComponent!: CreateOperationRequestsComponent;
  @ViewChild(ListOperationRequestsComponent) listOperationRequestsComponent!: ListOperationRequestsComponent;
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
        label: 'OperationRequests',
        icon: '',
        items: [
          {
            label: 'CreateRequest',
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
    this.router.navigate(['/doctorDashboard/home']); 
  }

  createOperationRequest() {
    this.createOperationRequestsComponent.showDialog();
  }

  listOperationRequests() {
    this.showOperationRequestsList = true;
    this.listOperationRequestsComponent.loadOperationRequests();
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
