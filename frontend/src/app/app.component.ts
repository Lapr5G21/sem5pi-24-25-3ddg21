import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
<<<<<<< HEAD
import { CreateOperationRequestComponent } from './components/doctorDashboard/operationRequests/create-operation-request/create-operation-request.component';
=======
import { CreateOperationTypesComponent } from './components/admin-dashboard/operationTypes/create-operation-types/create-operation-types.component';
>>>>>>> 9adcc12f1a842ab7bb8484efdac76e9dce47cb8a

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet,SidebarComponent,CreateOperationRequestComponent],
=======
  imports: [RouterOutlet,SidebarComponent,CreateOperationTypesComponent],
>>>>>>> 9adcc12f1a842ab7bb8484efdac76e9dce47cb8a
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
