import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../services/user-service.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    FormsModule
  ],
  styleUrls: ['./homepage.component.scss']
})
export class HomeComponent {
  isPolicyAccepted: boolean = false; // Estado do aceite da política
  displayPrivacyPolicy: boolean = false; // Estado do modal

  constructor(
    private auth: AuthService,
    private userService: UserService
  ) {}

  login() {
    if (this.isPolicyAccepted) {
      this.auth.loginWithRedirect();
    } else {
      alert('Você deve aceitar a Política de Privacidade antes de fazer login.');
    }
  }

  signup() {
    if (this.isPolicyAccepted) {
      this.auth.loginWithRedirect({
        authorizationParams: { screen_hint: 'signup' }
      });
    } else {
      alert('Você deve aceitar a Política de Privacidade antes de se registrar.');
    }
  }

  acceptPrivacyPolicy() {
    this.isPolicyAccepted = true; // Define que o usuário aceitou a política
    alert('Você aceitou a Política de Privacidade.');
  }

  showPrivacyPolicy(event: Event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    this.displayPrivacyPolicy = true; // Exibe o modal com a Política de Privacidade
  }
}
