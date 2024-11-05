import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
<<<<<<< HEAD
import { CreateOperationTypesComponent } from './components/adminDashboard/operationTypes/createOperationTypes/create-operation-types/create-operation-types.component';
import { CreateOperationRequestComponent } from './components/doctorDashboard/operationRequests/create-operation-request/create-operation-request.component';

=======
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
>>>>>>> 9adcc12f1a842ab7bb8484efdac76e9dce47cb8a

export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent }, 
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestComponent },
];
