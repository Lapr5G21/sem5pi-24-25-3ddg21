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

    getAppointmentsByPatient(id : string) : Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/appointments/patient/${id}`)
    }

    saveAppointment(appointmentData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          
        return this.http.post(`${this.apiUrl}/appointments`, appointmentData, {headers});
    }

    updateAppointment(appointmentData: any, formattedTeamIds : any): Observable<any> {
        const token = localStorage.getItem('access_token');
      
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      
        const payload = {
          id: appointmentData.id,
          surgeryRoomId: appointmentData.surgeryRoomDto.id,
          date: appointmentData.dateAndTime,
          teamIds: formattedTeamIds,
 
        };
      
        console.log('Payload enviado para o backend:', payload);
      
        return this.http.put(`${this.apiUrl}/appointments/${appointmentData.id}`, payload, { headers });
      }
      
}

