import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
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

  getSpecializationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specializations/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  saveStaff(staffData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
      });
    return this.http.post(`${this.apiUrl}/staffs`, staffData,{headers});
  }

  updateStaff(staffData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/staffs/${staffData.staffId}`, staffData);
  }
  
  getStaffById(staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staffs/${staffId}`);
  }

  searchStaffs(name: string, specializationId: string, isActive: boolean | null): Observable<any[]> {
    let params = new HttpParams();
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
      }); 
    if (name) {
      params = params.append('fullName', name);
    }
    if (specializationId) {
      params = params.append('specializationId', specializationId);
    }
    if (isActive !== null) {
      params = params.append('isActive', isActive.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/staffs/search`, { params,headers});
  }
}
