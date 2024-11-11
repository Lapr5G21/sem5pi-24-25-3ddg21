import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getStaffs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staffs`);
  }

  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specializations`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  saveStaff(staffData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/staffs`, staffData);
  }

  updateStaff(staffData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/staffs/${staffData.staffId}`, staffData);
  }
  
  getStaffById(staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staffs/${staffId}`);
  }
}
