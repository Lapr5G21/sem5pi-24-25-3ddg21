import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomTypeService {
    private apiUrl = 'https://localhost:5001/api';

    constructor(private http: HttpClient) {}

    getPatients(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/roomTypes`);
    }

    saveRoomType(roomTypeData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          
        return this.http.post(`${this.apiUrl}/roomTypes`, roomTypeData, {headers});
    }
      
}

