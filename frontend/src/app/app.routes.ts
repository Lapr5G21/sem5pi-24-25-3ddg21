import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationRequestsComponent } from './components/doctor-dashboard/operationRequests/create-operation-requests/create-operation-requests.component';
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';

export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent }, 
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestsComponent },
    { path: 'adminDashboard/home', component: AdminDashboardComponent },
    { path: 'doctorDashboard/home', component: DoctorDashboardComponent},
];
