import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu-component.component.html',
  imports : [DialogModule,CommonModule],
  standalone: true
})
export class ProfileMenuComponent {
  showProfileDialog: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public auth: AuthService
  ) {}



  openProfileDialog() {
    this.showProfileDialog = true;
  }

  closeProfileDialog() {
    this.showProfileDialog = false;
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: this.document.location.origin + '/home'} });
  }
}
