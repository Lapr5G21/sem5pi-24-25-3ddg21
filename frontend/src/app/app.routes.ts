import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOperationRequestsComponent } from './components/doctor-dashboard/operationRequests/create-operation-requests/create-operation-requests.component';
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
import { CreateStaffsComponent } from './components/admin-dashboard/staffs/create-staffs/create-staffs.component';
import { CreatePatientsComponent } from './components/admin-dashboard/patients/create-patients/create-patients.component';
import { EditStaffsComponent } from './components/admin-dashboard/staffs/edit-staffs/edit-staffs.component';
import { ListStaffsComponent } from './components/admin-dashboard/staffs/list-staffs/list-staffs.component';
import { EditPatientsComponent } from './components/admin-dashboard/patients/edit-patients/edit-patients.component';
import { ListPatientsComponent } from './components/admin-dashboard/patients/list-patients/list-patients.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/homepage/homepage.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { HospitalModelComponent } from './components/hospital-model/hospital-model/hospital-model.component';
import { ListOperationTypesComponent } from './components/admin-dashboard/operationTypes/list-operation-types/list-operation-types/list-operation-types.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';


export const routes: Routes = [
    { path: 'sidebar', component: SidebarComponent }, 
    { path: 'adminDashboard/operationtypes/create', component: CreateOperationTypesComponent },
    { path: 'adminDashboard/operationtypes/list', component: ListOperationTypesComponent },
    { path: 'adminDashboard/staffs/create', component: CreateStaffsComponent }, 
    { path: 'adminDashboard/staffs/edit', component: EditStaffsComponent },  
    { path: 'adminDashboard/staffs/list', component: ListStaffsComponent },    
    { path: 'adminDashboard/patients/create', component: CreatePatientsComponent },
    { path: 'adminDashboard/patients/edit', component: EditPatientsComponent },
    { path: 'adminDashboard/patients/list', component: ListPatientsComponent },
    { path: 'adminDashboard/home', component: AdminDashboardComponent },
    { path: 'home', component: HomeComponent },
    { path: 'patientDashboard/home', component: PatientDashboardComponent },
    { path: 'auth-callback', component: AuthCallbackComponent },
    { path: 'doctorDashboard/operationRequests/create', component: CreateOperationRequestsComponent },  
    { path: 'doctorDashboard/home', component: DoctorDashboardComponent },
    { path: 'hospitalModule', component: HospitalModelComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
