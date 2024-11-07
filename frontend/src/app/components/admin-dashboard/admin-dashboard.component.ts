import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateOperationTypesComponent } from './operationTypes/create-operation-types/create-operation-types.component';
import { MenuItem } from 'primeng/api';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, CreateOperationTypesComponent, MenubarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  items: MenuItem[] = [];

  @ViewChild(CreateOperationTypesComponent) createOperationTypesComponent!: CreateOperationTypesComponent;
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
    ];
  }

  createOperationType() {
    this.createOperationTypesComponent.showDialog(); 
  }
}
