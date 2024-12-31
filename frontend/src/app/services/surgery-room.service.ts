import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SurgeryRoomService {
    private apiUrl = 'https://localhost:5001/api';

    constructor(private http: HttpClient) {}

    getSurgeryRooms(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/surgeryRooms`);
    }

    saveSurgeryRoom(surgeryRoomData: any): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
          
        return this.http.post(`${this.apiUrl}/surgeryRooms`, surgeryRoomData, {headers});
    }
    
    
    delete(id: string): Observable<any> {
        
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  
          });
      
        return this.http.delete(`${this.apiUrl}/surgeryRooms/${id}`,{headers});    
      }
      
}

