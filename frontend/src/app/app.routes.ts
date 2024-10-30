// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'sidebar', component : SidebarComponent}
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];
