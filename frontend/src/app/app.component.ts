import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
import { CreateStaffsComponent } from './components/admin-dashboard/staffs/create-staffs/create-staffs.component';
import { EditStaffsComponent } from './components/admin-dashboard/staffs/edit-staffs/edit-staffs.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AdminDashboardComponent,MenubarComponent,CreateOperationTypesComponent, CreateStaffsComponent, EditStaffsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
