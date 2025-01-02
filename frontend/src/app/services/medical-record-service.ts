import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../domain/medical-record-model';
import { Allergy } from '../domain/allergy-model';
import { MedicalCondition } from '../domain/medical-condition-model';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }


  getMedicalRecords(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/medicalRecords`);
    }

    getAllergyById(allergyId: string): Observable<Allergy> {
      return this.http.get<Allergy>(`/api/allergies/${allergyId}`);
    }

    getMedicalConditionById(medicalConditionId: string): Observable<MedicalCondition> {
      return this.http.get<MedicalCondition>(`/api/medicalConditions/${medicalConditionId}`);
    }
    
  updateMedicalRecord(medicalRecordId: string,medicalRecordData: any): Observable<any> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
      });
      return this.http.put(`${this.apiUrl}/medicalRecords/${medicalRecordId}`, medicalRecordData, { headers });
      }

  saveMedicalRecord(medicalRecordData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/medicalRecords`, medicalRecordData);
  }      
}
