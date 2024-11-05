import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationRequestComponent } from './components/doctorDashboard/operationRequests/create-operation-request/create-operation-request.component';
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent }, 
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestComponent },
    { path: 'adminDashboard/home', component: AdminDashboardComponent },
];
