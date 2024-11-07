import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('Is authenticated:', isAuthenticated);  // Verifique o status de autenticação
      if (isAuthenticated) {
        this.authService.user$.subscribe(user => {
          console.log('User:', user);  // Verifique se o usuário está sendo obtido corretamente
  
          if (user) {
            const roles = user['https://healthcaresystem.com/roles'] || [];  
  
            if (Array.isArray(roles) && roles.includes('Admin')) {  
              console.log('Navigating to /adminDashboard/home');
              this.router.navigate(['/adminDashboard/home']);
            } else {
              console.log('Navigating to /user');
            }
          } else {
            console.log('No user data available');
          }
        });
      } else {
        console.log('User is not authenticated');
        this.router.navigate(['/']); 
      }
    });
  }
}  