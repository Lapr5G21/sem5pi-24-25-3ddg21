import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private apiUrl = 'https://localhost:5001/api';

    constructor(private http: HttpClient) {}

    getAppointments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/appointments`);
    }

    saveAppointment(appointmentData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          
        return this.http.post(`${this.apiUrl}/appointments`, appointmentData, {headers});
    }
      
}

