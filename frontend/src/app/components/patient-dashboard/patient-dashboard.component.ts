import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProfileMenuComponent } from '../admin-dashboard/profile-menu-component/profile-menu-component.component';
import { MenubarComponent } from '../menubar/menubar.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterOutlet,ProfileMenuComponent,MenubarComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {
  items: MenuItem[] = [];
  @ViewChild(ProfileMenuComponent) ProfileMenuComponent!: ProfileMenuComponent;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'My Account',
            command: () => {
              this.openProfileDialog()
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
  logout() {
    this.ProfileMenuComponent.logout();
  }

  openProfileDialog() {
    console.log("Clicou em Profile");
    if (this.ProfileMenuComponent) {
      console.log("Abrindo o diálogo de perfil...");
      this.ProfileMenuComponent.openProfileDialog();
    } else {
      console.log("Componente ProfileMenu não está disponível");
    }
  }
}

