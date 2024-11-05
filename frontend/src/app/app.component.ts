import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOperationRequestComponent } from './components/doctorDashboard/operationRequests/create-operation-request/create-operation-request.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent,CreateOperationRequestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
