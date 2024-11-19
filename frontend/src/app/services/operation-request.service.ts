import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getOperationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/operationTypes`);
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staffs`)
  }

  getOperationRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/operationRequests`)
  }

  getOperationRequestById(operationRequestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/operationRequests/${operationRequestId}`);
  }
  
  updateOperationRequest(operationRequestData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
      });
    return this.http.put(`${this.apiUrl}/operationRequests/${operationRequestData.operationRequestId}`, operationRequestData,{headers});
  }

  saveOperationRequest(operationRequestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/operationRequests`, operationRequestData);
  }

  removeOperationRequest(operationRequestId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/operationRequests/${operationRequestId}/delete`);
  }

}
