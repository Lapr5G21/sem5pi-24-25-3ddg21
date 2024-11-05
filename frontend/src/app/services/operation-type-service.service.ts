// operation-type.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    saveOperationType(operationTypeData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/operationtypes`, operationTypeData);
    }
}
