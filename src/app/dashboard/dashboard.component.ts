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
  result: any;
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
        
        if (data && this.selectedDelta in data) {
          this.result = data[this.selectedDelta];
          for (const key in data['districts']) {
          
            
            if(key == this.selectedDistrict){
            }
            
          }

          // Create charts
          this.amChartService.createPieChart('chartdiv1', this.result);
          this.amChartService.createPieChart('chartdiv2', this.result);
          this.amChartService.createBarChart('barchart');
        }
    
    }
  }
}
