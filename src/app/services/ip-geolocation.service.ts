import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IPGeolocationService {
  private baseUrl = 'http://ip-api.com/json';

  constructor(private http: HttpClient) {}

  getLocationFromIP(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
