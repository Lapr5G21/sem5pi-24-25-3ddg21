import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }


  getMedicalRecord(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/allergies`);
    }

    updateMedicalRecord(medicalRecordId: string,medicalRecordData: any): Observable<any> {
            const token = localStorage.getItem('access_token');
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });
            return this.http.put(`${this.apiUrl}/medicalRecords/${medicalRecordId}`, medicalRecordData, { headers });
        }
}
