import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatingSpecializationDto, Specialization, SpecializationDto } from '../domain/operationType-model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {
  
  private apiUrl = 'https://localhost:5001/api';
  
  constructor(private http: HttpClient) {}
  
  getSpecializations(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
    });
   return this.http.get<any[]>(`${this.apiUrl}/specializations`,{headers});
  }
  
  getSpecializationById(id: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
    });
    return this.http.get<any>(`${this.apiUrl}/specializations/${id}`,{headers});
  }

  saveSpecialization(specialization : CreatingSpecializationDto) : Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
    });
    return this.http.post(`${this.apiUrl}/specializations`, specialization,{headers});
  }

  removeSpecialization(specializationId : string) : Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
    });
    return this.http.delete(`${this.apiUrl}/specializations/${specializationId}`,{headers});
  }

  updateSpecialization(specialization : Specialization) : Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
    });

    return this.http.put(`${this.apiUrl}/specializations/${specialization.id}`,specialization,{headers});
  }

  searchSpecializations(name: string, code: string, description: string): Observable<any[]> {
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
    if (description) {
      params = params.append('description', description);
    }
    return this.http.get<any[]>(`${this.apiUrl}/specializations/search`, { params,headers});
  }

  }
