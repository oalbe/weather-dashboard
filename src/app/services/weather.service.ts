import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'http://www.7timer.info/bin/api.pl';

  constructor(private http: HttpClient) {}

  getWeatherData(latitude: number, longitude: number): Observable<any> {
    const params = {
      lon: longitude.toString(),
      lat: latitude.toString(),
      product: 'civil',
      unit: 'metric',
      output: 'json',
    };

    return this.http.get(this.baseUrl, { params });
  }
}
