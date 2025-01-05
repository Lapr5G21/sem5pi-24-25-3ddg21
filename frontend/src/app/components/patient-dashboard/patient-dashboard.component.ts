import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProfileMenuComponent } from '../admin-dashboard/profile-menu-component/profile-menu-component.component';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';
import { PatientAccountComponent } from './patient-account-component/patient-account-component.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterOutlet, ProfileMenuComponent, MenubarComponent, PatientAccountComponent, CommonModule, MyAppointmentsComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent {
  items: MenuItem[] = [];
  showPatientAccountPanel: boolean = false;
  showMyAppointments: boolean = false;
  @ViewChild(PatientAccountComponent) PatientAccountComponentComponent!: PatientAccountComponent;
  @ViewChild(MyAppointmentsComponent) MyAppointmentsComponent!: MyAppointmentsComponent;
  @ViewChild(ProfileMenuComponent) ProfileMenuComponent!: ProfileMenuComponent;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'My Appointments',
        icon: 'pi pi-calendar',
        command: () => {
          this.showMyAppointments = true;
          this.showPatientAccountPanel = false;
          this.showPatientAppointments();
        }
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'My Account',
            command: () => {
              this.showPatientAccount();
              this.showPatientAccountPanel = true;
              this.showMyAppointments = false;
            }
          },
          {
            label: 'Logout',
            command: () => this.logout()
          }
        ]
      }
    ];
  }

  showPatientAccount() {
    if (this.PatientAccountComponentComponent) {
      this.PatientAccountComponentComponent.fetchPatientData();
    }
  }

  showPatientAppointments() {
    if (this.MyAppointmentsComponent) {
      this.MyAppointmentsComponent.getPatient();
    }
  }

  logout() {
    this.ProfileMenuComponent.logout();
  }

  downloadMedicalRecord() {
    
  }
}
