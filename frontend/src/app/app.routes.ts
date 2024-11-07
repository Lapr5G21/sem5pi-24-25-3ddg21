import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationRequestsComponent } from './components/doctor-dashboard/operationRequests/create-operation-requests/create-operation-requests.component';
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/homepage/homepage.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent }, 
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestsComponent },
    { path: 'adminDashboard/home', component: AdminDashboardComponent },
    { path: 'home', component: HomeComponent },
    { path: 'auth-callback', component: AuthCallbackComponent },  
];
