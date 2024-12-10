import { HttpClient } from '@angular/common/http';
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
}
