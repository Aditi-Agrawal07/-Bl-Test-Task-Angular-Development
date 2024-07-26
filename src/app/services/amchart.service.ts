import { Injectable, NgZone } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy"
import { ApiCallService } from './api-call.service';
import { connect } from 'rxjs';
import { CountryService } from './country.service';

@Injectable({
  providedIn: 'root'
})
export class AmchartService {
  vaccinationData: { statename: string, vaccination1: number, vaccination2: number }[] = [];
  constructor(private zone: NgZone,
    private apiCall: ApiCallService, private countryService: CountryService) {
    this.apiCall.getAlldata().subscribe((item) => {
      this.extractVaccinationData(item)

    })
  }

  extractVaccinationData(item: any) {
    for (const key in item) {
      const statename = key
      if (item[key].total) {
        const vaccination1 = item[key].total.vaccinated1;
        const vaccination2 = item[key].total.vaccinated2;



        if (vaccination1 !== undefined && vaccination2 !== undefined) {
          this.vaccinationData.push({ statename, vaccination1, vaccination2 });
        }
      }
    }
  }

 
  private chartInstances: { [key: string]: am5.Root } = {};
  createPieChart(chartId: string, data: any) {
    // Dispose of the previous chart instance if it exists
    if (this.chartInstances[chartId]) {
      this.chartInstances[chartId].dispose();
    }
    this.zone.runOutsideAngular(() => {
      let root = am5.Root.new(chartId);
      
      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        endAngle: 270
      }));



      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
        innerRadius: am5.percent(50)
      }));

      series.states.create("hidden", {
        endAngle: -90
      });


      const transformedData = Object.keys(data).map(key => ({
        category: key,
        value: data[key]
      }));
     

console.log(transformedData);

      series.data.setAll(transformedData);
      series.appear(1000, 100);
      this.chartInstances[chartId] = root;
    });
  }

  createBarChart(chartId: string) {
    this.zone.runOutsideAngular(() => {
      let root = am5.Root.new(chartId);
      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
      }));

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );

      let xRenderer = am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true
      });

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "statename",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      xRenderer.grid.template.setAll({
        location: 1
      });

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
      }));

      function makeSeries(name: string, fieldName: string) {
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "statename"
        }));

        series.columns.template.setAll({
          tooltipText: "{vaccination1}, {vaccination2}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0
        });

        series.data.setAll(data);

        series.appear();

        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Label.new(root, {
              text: "{valueY}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: 0,
              centerX: am5.p50,
              populateText: true
            })
          });
        });

        legend.data.push(series);
      }

      let data = this.vaccinationData;
      xAxis.data.setAll(data);

      makeSeries("Vaccination 1", "vaccination1");
      makeSeries("Vaccination 2", "vaccination2");

      chart.appear(1000, 100);
    });
  }
}
