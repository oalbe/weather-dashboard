export interface DataseriesPoint {
  timepoint: number;
  cloudcover: number;
  lifted_index: number;
  prec_type: string;
  prec_amount: number;
  temp2m: number;
  rh2m: string;
  wind10m: Wind10m;
  weather: string;
};

export interface Wind10m {
  direction: string;
  speed: number;
};

export interface DayForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  averageTemperature: string;
  weather: string;
  averageWindSpeed: string;
  windDirection: string;
  averageRelativeHumidity: string;
  periods: [];
}
  
export interface WeatherForecast {
  days: DayForecast[];
};