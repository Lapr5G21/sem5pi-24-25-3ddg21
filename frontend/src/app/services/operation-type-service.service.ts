// operation-type.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OperationTypeService {
    private apiUrl = 'https://localhost:5001/api';

    constructor(private http: HttpClient) {}

    getSpecializations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/specializations`);
    }

    getSpecializationById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/specializations/${id}`);
    }

    getOperationTypes(): Observable<any[]> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
        return this.http.get<any[]>(`${this.apiUrl}/operationtypes`,{headers});
    }

    saveOperationType(operationTypeData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          console.log(headers);
        return this.http.post(`${this.apiUrl}/operationtypes`, operationTypeData,{headers});
    }

    searchOperationTypes(name: string, specializationId: string, isActive: boolean | null): Observable<any[]> {
        let params = new HttpParams();
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          }); 
        if (name) {
          params = params.append('name', name);
        }
        if (specializationId) {
          params = params.append('specializationId', specializationId);
        }
        if (isActive !== null) {
          params = params.append('isActive', isActive.toString());
        }
    
        return this.http.get<any[]>(`${this.apiUrl}/operationTypes/search`, { params,headers});
      }
}
