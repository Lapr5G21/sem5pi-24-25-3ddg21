import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../services/user-service.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [CardModule, ButtonModule],
  styleUrls: ['./homepage.component.scss']
})
export class HomeComponent {
  constructor(private auth: AuthService, private userService: UserService) {}

  login() {
    this.auth.loginWithRedirect();
  }

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' }
    });
  }

  private registerUserInBackend(user: any) {
    this.userService.registerUserOnBackend().subscribe({
      next: (response) => {
        console.log('Usuário registrado no backend:', response);
      },
      error: (error) => {
        console.error('Erro ao registrar o usuário no backend:', error);
      }
    });
  }
}
