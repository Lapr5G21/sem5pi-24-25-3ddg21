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

  gettaffById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staffs/${id}`);
  }

  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specializations`);
  }

  getSpecializationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specializations/${id}`);
  }

  getAvailabilitySlots(staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staffs/${staffId}/availability-slots`);
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
  
  getStaffById(staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staffs/${staffId}`);
  }

  searchStaffs(name: string, phonenUmber: string, email: string, specializationId: string, isActive: boolean | null): Observable<any[]> {
    let params = new HttpParams();
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  
      }); 
    if (name) {
      params = params.append('fullName', name);
    }
    if (phonenUmber) {
      params = params.append('phonenUmber', phonenUmber);
    }
    if (email) {
      params = params.append('email', email);
    }
    if (specializationId) {
      params = params.append('specializationId', specializationId);
    }
    if (isActive !== null) {
      params = params.append('isActive', isActive.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/staffs/search`, { params,headers});
  }

  addAvailabilitySlot(staffId: string, slot: { start: string, end: string }): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    const payload = {
        start: slot.start,
        end: slot.end,
        staffId: staffId
    };

    return this.http.post<any>(`${this.apiUrl}/staffs/${staffId}/availability-slots`, payload, { headers });
}

removeAvailabilitySlot(staffId: string, slot: { start: string, end: string }): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
  });

  const payload = {
      staffId: staffId,
      start: slot.start,
      end: slot.end
  };

  return this.http.delete(`${this.apiUrl}/staffs/${staffId}/availability-slots`, {
    body: payload,  
    headers
  });
}

updateStaff(staffData: any): Observable<any> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  console.log('staffData', staffData);

  return this.http.put(`${this.apiUrl}/staffs/${staffData.staffId}`, staffData, { headers });
}


}
