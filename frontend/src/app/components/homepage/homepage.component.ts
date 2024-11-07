import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; 
@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  standalone : true,
  imports : [CardModule,ButtonModule],
  styleUrls: ['./homepage.component.scss']
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  login() {    
    this.auth.loginWithRedirect();
  }

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' }
    });
  }
}
