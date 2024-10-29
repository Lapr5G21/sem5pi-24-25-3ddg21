import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],  
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomePageComponent {
  constructor(public auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect();
  }

  signUp() {
    this.auth.loginWithRedirect();
  }
}
