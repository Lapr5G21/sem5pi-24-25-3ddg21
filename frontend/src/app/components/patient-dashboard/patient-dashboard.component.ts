import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProfileMenuComponent } from '../admin-dashboard/profile-menu-component/profile-menu-component.component';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';
import { PatientAccountComponent } from './patient-account-component/patient-account-component.component';
import { CommonModule } from '@angular/common';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { DownloadMedicalRecordComponent } from './download-medical-record/download-medical-record.component';  // Importe o componente

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterOutlet, ProfileMenuComponent, MenubarComponent, PatientAccountComponent, CommonModule, MyAppointmentsComponent, DownloadMedicalRecordComponent],  // Adicione o componente aqui
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
  @ViewChild(DownloadMedicalRecordComponent) downloadMedicalRecordComponent!: DownloadMedicalRecordComponent;

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
        label: 'Medical Record',
        items:[
          {
            label: 'Download',
            icon: 'pi pi-download',
            command: () => {
              this.showDownloadMedicalRecord();
            }
            },
        ]  
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

  showDownloadMedicalRecord() {
    if (this.downloadMedicalRecordComponent) {
      this.downloadMedicalRecordComponent.generatePDF();  
    }  
  }

  logout() {
    this.ProfileMenuComponent.logout();
  }
}
