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

  registerUserOnBackend(): Observable<any> {
    return new Observable((observer) => {
      this.auth0.user$.subscribe((user) => {
        if (user) {
          const { email, name, sub } = user;

          if (user['https://healthcaresystem.com/isNewUser']) {
            this.http.post(this.apiUrl+ '/users/patients', { email, name }).subscribe({
              next: (response) => {
                observer.next(response);
              },
              error: (error) => {
                observer.error(error);
              },
            });
          } else {
            observer.next({ message: 'Usuário já registrado' });
          }
        }
      });
    });
  }

  deletePatient(medicalRecordNumber : string) : Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
      });
      return this.http.delete(`${this.apiUrl}/${medicalRecordNumber}`, { headers });
  }
  }