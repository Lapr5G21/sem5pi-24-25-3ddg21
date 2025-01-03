import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getMedicalConditions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicalConditions`);
  }

  getMedicalConditionByCode(medicalConditionCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicalConditions/${medicalConditionCode}`);
  }

  getMedicalConditionByPatientMedicalRecordNumber(number: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicalConditions/${number}`);
  }

  saveMedicalCondition(medicalConditonData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicalConditions`, medicalConditonData);
  }

  removeMedicalCondition(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicalConditions/${id}/delete`);
  }

  searchMedicalConditions(name: string, code: string): Observable<any[]> {
    let params = new HttpParams();
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
      }); 
    if (name) {
      params = params.append('name', name);
    }
    if (code) {
      params = params.append('code', code);
    }

    return this.http.get<any[]>(`${this.apiUrl}/medicalConditions/search`, { params,headers});
  }

  updateMedicalCondition(id: string, medicalConditionData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const payload = {
      id: id,
      name: medicalConditionData.name,
      code: medicalConditionData.code,
      description: medicalConditionData.description,
      symptoms: medicalConditionData.symptoms,
    };
  
    console.log('Payload enviado para o backend:', payload);
  
    return this.http.put(`${this.apiUrl}/medicalConditions`, payload, { headers });
  }
}
