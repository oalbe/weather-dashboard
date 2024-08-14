import { Component, Input } from '@angular/core';
import { DataseriesPoint } from '../../types/dashboard.types';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
})
export class CurrentWeatherComponent {
  @Input() weather: DataseriesPoint;

  get weatherIconPath() {
    return `assets/img/${this.weather.weather}.svg`;
  }

  get temperatureUnit() {
    return '°C';
  }
}
