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
  
  updateOperationRequest(id: string, operationRequestData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const payload = {
        priorityLevel: operationRequestData.priorityLevel,
        id: operationRequestData.id,
        deadlineDate: operationRequestData.deadlineDate,
        operationTypeId : operationRequestData.operationTypeId,
        status: operationRequestData.status,
        doctorId: operationRequestData.doctorId,
        pacientMedicalRecordNumber: operationRequestData.pacientMedicalRecordNumber};
    
        console.log('Payload enviado para o backend:', payload);
        console.log(`Request URL: ${this.apiUrl}/operationRequests/${id}`);

        return this.http.put(`${this.apiUrl}/operationRequests/${id}`, operationRequestData, {headers});
  }

  saveOperationRequest(operationRequestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/operationRequests`, operationRequestData);
  }

  removeOperationRequest(operationRequestId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/operationRequests/${operationRequestId}/delete`);
  }

}
