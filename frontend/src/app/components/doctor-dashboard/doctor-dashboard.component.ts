import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';
import { CreateOperationRequestsComponent } from './operationRequests/create-operation-requests/create-operation-requests.component';
import { ListOperationRequestsComponent } from './operationRequests/list-operation-requests/list-operation-requests.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarComponent,
    CreateOperationRequestsComponent,
    ListOperationRequestsComponent,
    CommonModule
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  items: MenuItem[] = [];
  showOperationRequestsList: boolean = false;

  @ViewChild(CreateOperationRequestsComponent) createOperationRequestsComponent!: CreateOperationRequestsComponent;
  @ViewChild(ListOperationRequestsComponent) listOperationRequestsComponent!: ListOperationRequestsComponent;

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
            label: 'Request',
            icon: 'pi pi-check',
            command: () => this.createOperationRequest()
          },
          {
            label: 'Search/List',
            icon: 'pi pi-list',
            command: () => this.listOperationRequests()
          }
        ]
      }
    ];
  }

  goHome() {
    this.showOperationRequestsList = false; 
    this.router.navigate(['/doctorDashboard/home']); 
  }

  createOperationRequest() {
    this.createOperationRequestsComponent.showDialog();
  }

  listOperationRequests() {
    this.showOperationRequestsList = true;
    this.listOperationRequestsComponent.loadOperationRequests();
  }
}
