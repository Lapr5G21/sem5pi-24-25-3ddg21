import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllergyService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getAllergies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allergies`);
  }

  getAllergyByCode(allergyCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/allergies/${allergyCode}`);
  }

  saveAllergy(allergyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/allergies`, allergyData);
  }

  removeAllergy(allergyCode: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/allergies/${allergyCode}/delete`);
  }

  updateAllergy(id: string, allergyData: any): Observable<any> {
      const token = localStorage.getItem('access_token');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    
      const payload = {
        id: id,
        name: allergyData.name,
        code: allergyData.code,
        description: allergyData.description,
      };
    
      console.log('Payload enviado para o backend:', payload);
    
      return this.http.put(`${this.apiUrl}/allergies`, payload, { headers });
    }
}
