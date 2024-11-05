import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationTypesComponent } from './components/adminDashboard/operationTypes/createOperationTypes/create-operation-types/create-operation-types.component';

export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'operationtypes/create', component: CreateOperationTypesComponent }, 
];
