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
      const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
        return this.http.put(`${this.apiUrl}/patients/${patientData.medicalRecordNumber}`, patientData,{headers});
      }

      searchPatients(
        id: string,
        name: string,
        phoneNumber: string,
        birthDate: string,
        email: string,
        isActive: boolean | null
      ): Observable<any[]> {
        let params = new HttpParams();
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      
        // Adiciona os filtros conforme definidos
        if (id) {
          params = params.append('id', id);
        }
        if (name) {
          params = params.append('name', name);
        }
        if (phoneNumber) {
          params = params.append('phoneNumber', phoneNumber);
        }
        if (birthDate) {
          params = params.append('birthDate', birthDate);
        }
        if (email) {
          params = params.append('email', email);
        }
        if (isActive !== null) {
          params = params.append('isActive', isActive.toString());
        }
      
        return this.http.get<any[]>(`${this.apiUrl}/patients/search`, { params, headers });
      }
      

      getPatientByEmail(email: string): Observable<any> {
        const params = new HttpParams().set('email', email);
        return this.http.get(`${this.apiUrl}/patients/by-email`, { params });
      }
}

