import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu-component.component.html',
  imports : [DialogModule,CommonModule],
  standalone: true
})
export class ProfileMenuComponent {
  showProfileDialog: boolean = false;
  role : any = localStorage.getItem('role');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public auth: AuthService,
    public userService : UserService
  ) {}



  openProfileDialog() {
    this.showProfileDialog = true;
  }

  closeProfileDialog() {
    this.showProfileDialog = false;
  }

  logout() {
    this.userService.logout()
    }
}
