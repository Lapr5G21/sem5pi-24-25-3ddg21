import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationTypesComponent } from './components/adminDashboard/operationTypes/createOperationTypes/create-operation-types/create-operation-types.component';
import { CreateOperationRequestComponent } from './components/doctorDashboard/operationRequests/create-operation-request/create-operation-request.component';


export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent }, 
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestComponent },
];
