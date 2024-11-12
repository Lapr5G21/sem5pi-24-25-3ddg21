// patient-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        return this.http.post(`${this.apiUrl}/patients`, patientData);
    }
}

