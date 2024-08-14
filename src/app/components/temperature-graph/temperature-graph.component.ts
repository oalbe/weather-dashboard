import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DayForecast } from '../../types/dashboard.types';

@Component({
  selector: 'app-temperature-graph',
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss'],
  imports: [BaseChartDirective],
  standalone: true,
})
export class TemperatureGraphComponent implements OnInit {
  @Input() temperatureData: DayForecast[];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        min: 0,
        max: 50,
        ticks: {
          stepSize: 5,
        }
      },
    }
  };

  public lineChartType: ChartType = 'line';

  ngOnInit() {
    const nextFiveDays = this.temperatureData.slice(0, 5);
    const periods: any[] = nextFiveDays.flatMap(arr => arr.periods);
    const temperatures = periods.map((periodElement: { temperature: number; }) => periodElement.temperature);

    this.lineChartData.labels = periods.map((day: { timepoint: string; }) => day.timepoint.replace('/2024', ''));
    this.lineChartData.datasets = [{
      data: temperatures,
      label: 'Temperature (°C)',
      borderColor: 'rgba(65, 83, 124, 1)',
      backgroundColor: 'rgba(45, 185, 207, 0.7)',
      fill: true,
    }];

    if (this.lineChartOptions.scales?.['y']) {
      this.lineChartOptions.scales['y'].min = Math.floor(Math.min(...temperatures) / 5) * 5 - 5;
      this.lineChartOptions.scales['y'].max = Math.ceil(Math.max(...temperatures) / 5) * 5 + 5;

      this.chart?.update();
    }
  }
}
