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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    
      const payload = {
        medicalRecordNumber: patientData.medicalRecordNumber,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        fullName: patientData.fullName,
        medicalHistory: patientData.medicalRecord,
        email: patientData.email,
        phoneNumber: patientData.phoneNumber,
        address: patientData.address
      };
    
      console.log('Payload enviado para o backend:', payload);
    
      return this.http.put(`${this.apiUrl}/patients/${patientData.medicalRecordNumber}`, payload, { headers });
    }

    searchPatients(name: string, birthDate: string, gender: string, email: string, phoneNumber: string, mrn: string, isActive: boolean | null): Observable<any[]> {
        let params = new HttpParams();
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      
        // Adiciona os filtros conforme definidos
        if (name) {
          params = params.append('name', name);
        }
        if (birthDate) {
          params = params.append('birthDate', birthDate);
        }
        if (gender) {
          params = params.append('gender', gender);
        }
        if (email) {
          params = params.append('email', email);
        }
        if (phoneNumber) {
          params = params.append('phoneNumber', phoneNumber);
        }
        if (mrn) {
          params = params.append('mrn', mrn);
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

