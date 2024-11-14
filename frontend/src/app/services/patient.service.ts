// patient-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = 'https://localhost:5001/api';

    constructor(private http: HttpClient) {}

    getPatients(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/patients`);
    }

    savePatient(patientData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          
        return this.http.post(`${this.apiUrl}/patients`, patientData, {headers});
    }

    updatePatient(patientData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/patients/${patientData.Id}`, patientData);
      }

      searchPatients(name: string, birthDate: string, isActive: boolean | null): Observable<any[]> {
        let params = new HttpParams();
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          }); 
        if (name) {
          params = params.append('name', name);
        }
        if (birthDate) {
          params = params.append('birthDate', birthDate);
        }
        if (isActive !== null) {
          params = params.append('isActive', isActive.toString());
        }
    
        return this.http.get<any[]>(`${this.apiUrl}/patients/search`, { params,headers});
      }
}

