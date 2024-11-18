import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('Is authenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        this.authService.idTokenClaims$.subscribe(idToken => {
          console.log('ID Token:', idToken);
          
          if (idToken?.__raw) { 
            localStorage.setItem('access_token', idToken.__raw); 
            console.log('Token armazenado no localStorage');

            this.authService.user$.subscribe(user => {
              const roles = user?.['https://healthcaresystem.com/roles'] ?? [];
              localStorage.setItem('role', roles);
              var email;
              if(user?.email){
                localStorage.setItem('email',user.email.toString());
              }

              if (user && user['https://healthcaresystem.com/isNewUser']) {
                this.registerUserInBackend(user);
              }

              if (Array.isArray(roles) && roles.includes('Admin')) {  
                console.log('Navigating to /adminDashboard/home');
                this.router.navigate(['/adminDashboard/home']);
              } else  if(Array.isArray(roles) && roles.includes('Patient')){
                console.log('Navigating to /patientDashboard/home');
                this.router.navigate(['/patientDashboard/home']);
              } else if (Array.isArray(roles) && roles.includes('Doctor')){
                console.log('Navigating to /doctorDashboard/home');
                this.router.navigate(['/doctorDashboard/home']);
              }
            });
          } else {
            console.log('No token available');
          }
        });
      } else {
        console.log('User is not authenticated');
        this.router.navigate(['/']);
      }
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
