import { Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AmchartService } from '../services/amchart.service';
import { CountryService } from '../services/country.service';
import { JsonPipe } from '@angular/common';
import { ApiCallService } from '../services/api-call.service';
import { Observable, take } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [FormsModule, JsonPipe]
})


export class DashboardComponent implements OnChanges {
  @Input() selectedState?: string;
  @Input() selectedDelta?: string;
  @Input() selectedDistrict?: string;

  countryNames: string[] = [];
  data1: any;
  delta!: any;
  firstchartResult: any;
  secondChartResult: any

  constructor(
    private amChartService: AmchartService,
    private countryService: CountryService,
    private apiCall: ApiCallService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedState'] || changes['selectedDelta'] || changes['selectedDistrict']) {
     
      
      await this.updateCharts();
    }
  }

  async updateCharts() {
    if (this.selectedState && this.selectedDelta) {
    
        // Fetch data based on the selected state and delta
        const data = await this.countryService.getselectedStateData();
        
        if (data) {
          if (this.selectedDelta in data) {
            this.firstchartResult = data[this.selectedDelta];
            console.log("Selected Delta Data:", this.firstchartResult);
          }

          if (this.selectedDistrict && data.districts && data.districts[this.selectedDistrict]) {
            this.secondChartResult = data.districts[this.selectedDistrict][this.selectedDelta];
            console.log("Selected District Data:", this.secondChartResult);
          } 
         
          // Create charts
          if(this.firstchartResult && this.secondChartResult){
            this.amChartService.createPieChart('chartdiv1', this.firstchartResult);
          this.amChartService.createPieChart('chartdiv2', this.secondChartResult);
          }
          this.amChartService.createBarChart('barchart');
        }
    
    }
  }
}
