import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private baseUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) {}

  getLocationName(latitude: number, longitude: number): Observable<any> {
    const apiKey = 'e4752156644a4de5aba27bac371f0688';

    const params = {
      q: `${latitude}+${longitude}`,
      key: apiKey
    };
   
    return this.http.get(this.baseUrl, { params });
  }
}
