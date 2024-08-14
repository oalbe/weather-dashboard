import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { TemperatureGraphComponent } from '../temperature-graph/temperature-graph.component';
import { LocationService } from '../../services/location.service';
import { IPGeolocationService } from '../../services/ip-geolocation.service';
import { DataseriesPoint, WeatherForecast } from '../../types/dashboard.types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  providers: [WeatherService, LocationService, IPGeolocationService],
  imports: [CommonModule, CurrentWeatherComponent, ForecastComponent, TemperatureGraphComponent],
})
export class DashboardComponent implements OnInit {
  // Weather info
  currentWeather: DataseriesPoint;
  forecast: WeatherForecast;
  temperatureData: any[] = [];

  // Location info
  country: string;
  state: string;
  city: string;

  forecastComplete$: Promise<boolean>;
  currentWeatherComplete$: Promise<boolean>;

  get currentDate() {
    return new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome', hour12: false, weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' });
  }

  get currentTime() {
    return new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome', hour12: false, hour: '2-digit', minute:'2-digit' });
  }

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private ipGeolocationService: IPGeolocationService
  ) {}

  ngOnInit() {
    // Determine location from HTML5 location API
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      this.locationService.getLocationName(latitude, longitude).subscribe((data: any) => {
        const locationData = data.results[0].components;
        this.city = locationData.city || locationData.town || locationData.village;
        this.country = locationData.country;
        this.state = locationData.state;
      });

      this.getWeatherDataHelper(latitude, longitude);
    }, () => {
      // User denied geolocation permission. Falling back to geolocation by IP through external API
      this.ipGeolocationService.getLocationFromIP().subscribe((ipGeolocationData: any) => {
        this.city = ipGeolocationData.city;
        this.country = ipGeolocationData.country;
        this.state = ipGeolocationData.regionName;

        this.getWeatherDataHelper(ipGeolocationData.lat, ipGeolocationData.lon);
      });
    });
  }

  private parseDataseries(data: any) {
    return data.dataseries.map((entry: any) => {
      const startTime = new Date(
        data.init.substring(0, 4), 
        data.init.substring(4, 6) - 1, 
        data.init.substring(6, 8), 
        parseInt(data.init.substring(8, 10))
      );
      const entryTime = new Date(startTime.getTime() + entry.timepoint * 3600000);
      const localTime = entryTime.toLocaleString('en-GB', { timeZone: 'Europe/Rome', hour12: false });

      return {
          timepoint: localTime,
          temperature: entry.temp2m,
          weather: entry.weather,
          windSpeed: entry.wind10m.speed,
          windDirection: entry.wind10m.direction,
          relativeHumidity: entry.rh2m,
          date: entryTime.toISOString().split('T')[0]
      };
    });
  }

  private aggregatePeriodsByDate(weatherData: any) {
    return weatherData.reduce((acc: any, entry: any) => {
      if (!acc[entry.date]) {
          acc[entry.date] = { temperatures: [], weather: [], windSpeeds: [], windDirections: [], relativeHumidities: [], periods: [] };
      }

      acc[entry.date].temperatures.push(entry.temperature);
      acc[entry.date].weather.push(entry.weather);
      acc[entry.date].windSpeeds.push(entry.windSpeed);
      acc[entry.date].windDirections.push(entry.windDirection);
      acc[entry.date].relativeHumidities.push(entry.relativeHumidity);
      acc[entry.date].periods.push({
          ...entry
      });

      return acc;
    }, {});
  }

  private averageDataForForecast(dailyData: any) {
    const weatherSummary: { days: any } = {
      days: []
    };

    // Prepare averages for 7-day forecast
    for (const date in dailyData) {
      const dayData = dailyData[date];
      const avgTemp = dayData.temperatures.reduce((acc: number, temp: number) => acc + temp) / dayData.temperatures.length;
      const avgWindSpeed = dayData.windSpeeds.reduce((acc: any, windSpeed: any) => acc + windSpeed) / dayData.windSpeeds.length;
      const avgRelativeHumidity = dayData.relativeHumidities.reduce((acc: number, humidity: string) => {
        return acc + parseInt(humidity.substring(0, humidity.length - 1), 10);
      }, 0) / dayData.relativeHumidities.length;

      weatherSummary.days.push({
          date: date,
          minTemp: Math.min(...dayData.temperatures),
          maxTemp: Math.max(...dayData.temperatures),
          averageTemperature: avgTemp.toFixed(2),
          weather: dayData.weather[0],
          averageWindSpeed: avgWindSpeed.toFixed(1),
          windDirection: dayData.windDirections[0],
          averageRelativeHumidity: `${avgRelativeHumidity.toFixed(0)}%`,
          periods: dayData.periods,
      });
    }

    return weatherSummary;
  }

  private getWeatherDataHelper(latitude: number, longitude: number) {
    this.weatherService.getWeatherData(latitude, longitude).subscribe((data) => {
      this.currentWeather = data.dataseries[0];
      this.currentWeatherComplete$ = Promise.resolve(true);

      const weatherData = this.parseDataseries(data);
      const dailyData = this.aggregatePeriodsByDate(weatherData);
      const weatherSummary = this.averageDataForForecast(dailyData);

      this.forecast = {
        ...weatherSummary,
        days: weatherSummary.days.slice(1, 8)
      };

      this.forecastComplete$ = Promise.resolve(true);
    });
  }
}
