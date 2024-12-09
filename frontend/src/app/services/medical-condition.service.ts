import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  private apiUrl = 'https://localhost:4000/api';

  constructor(private http: HttpClient) {}

  saveMedicalCondition(medicalConditonData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
      });
    return this.http.post(`${this.apiUrl}/medicalConditons`, medicalConditonData,{headers});
  }

}
