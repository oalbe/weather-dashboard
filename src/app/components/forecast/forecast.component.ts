import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WeatherForecast } from '../../types/dashboard.types';

@Component({
  selector: 'app-forecast',
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
})
export class ForecastComponent {
  @Input() forecast: WeatherForecast;

  get temperatureUnit() {
    return '°C';
  }

  getWeatherIconPath(weather: string) {
    return `assets/img/${weather}.svg`;
  }

  dayNameFromDate(date: string, locale: string = 'en-GB') {
    return new Date(date).toLocaleDateString(locale, { weekday: 'long' });
  }

  dayAndMonthFromDate(date: string) {
    const _date = new Date(date)
    return `${_date.getUTCDate()}/${_date.getUTCMonth() + 1}`;
  }
}
