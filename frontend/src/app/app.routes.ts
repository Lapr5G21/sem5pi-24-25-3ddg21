// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'sidebar', component : SidebarComponent},
  { path: 'table', component : TableComponent}
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];
