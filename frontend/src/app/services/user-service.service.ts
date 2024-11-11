import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, from, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { LoginDto } from '../domain/loginDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginDto: LoginDto | null = null;
  private apiUrl : string = 'https://localhost:5001/api';

  constructor(private auth0: Auth0Service, private http: HttpClient) {}

  logout() {
    this.auth0.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    this.loginDto = null;
  }

  
  
}
