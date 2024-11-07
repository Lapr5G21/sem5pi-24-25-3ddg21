import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';
import { CreateOperationRequestsComponent } from './operationRequests/create-operation-requests/create-operation-requests.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterOutlet,MenubarComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss'
})
export class DoctorDashboardComponent implements OnInit {
items: MenuItem[] = [];

@ViewChild(CreateOperationRequestsComponent) createOperationRequestsComponent!: CreateOperationRequestsComponent;

ngOnInit() {

  this.items = [
      { 
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'OperationRequests',
        icon: '',
        items: [
          {
            label : 'Request',
            icon : 'pi pi-check',
            command: () => this.createOperationRequest()
          },
          {
            label : 'Search/List',
            icon: 'pi pi-list'
          }
        ]
      }
  ]
}

  createOperationRequest() {
    this.createOperationRequestsComponent.showDialog();
  }
}