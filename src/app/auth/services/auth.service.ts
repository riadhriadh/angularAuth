import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private httpClient: HttpClient) { }

    login(data): Observable<any> {
        return this.httpClient.post('http://localhost:3001/login', data, {observe: 'response'});
    }
}
