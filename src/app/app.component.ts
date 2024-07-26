import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CountryService } from './services/country.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, DashboardComponent]
})
export class AppComponent implements OnInit, OnChanges {
  
  selectedDelta: string = "delta"
  State: string = "Madhya Pradesh"
  stateabbr: string | undefined = "MP"
  selectedDistrict: string | undefined ="Dewas";

  // on delta select dropdown
  selectdelta(event: any) {
    const targetElement = event.target as HTMLElement
    this.selectedDelta = targetElement.innerHTML   
    this.countryService.setDellta(this.selectedDelta)

  }

  // on state select dropdown
  selectState(event: any) {
    const targetElement = event.target as HTMLElement
    this.State = targetElement.innerHTML
    this.stateabbr = this.countryService.getstateAbbr(this.State);
    this.countryService.setState(this.stateabbr)
    this.getDistricts()
    this.countryService.getselectedStateData()
  }

  // on select district dropdown
  selectDistrict(event: any) {
    const targetElement = event.target as HTMLElement
    this.selectedDistrict = targetElement.innerHTML

  }

  constructor(private countryService: CountryService) { }
  async ngOnChanges(changes: SimpleChanges) {
    this.countryNames = this.countryService.getstateName().map((element) => {
      return element.name
    });
    let selectedAbbr = this.countryService.getstateName().find(element => element.name == this.State)
    this.districtdata = await this.countryService.getdistrict(selectedAbbr?.abbreviation)
    this.districts = Object.keys(this.districtdata)
  }

  countryNames: String[] = []
  districtdata: any
  districts!: String[]
  selectedAbbr: any

  async ngOnInit() {
    this.countryNames = this.countryService.getstateName().map((element) => {
      return element.name
    });

    this.countryService.setState("MP");
    this.countryService.setDellta("delta")
    this.selectedAbbr = this.countryService.getstateName().find(element => element.name == this.State)

    this.districtdata = await this.countryService.getdistrict(this.selectedAbbr?.abbreviation)

    this.districts = Object.keys(this.districtdata)

  }

  onCountryChange(): void {
    this.getDistricts();
    this.countryService.getselectedStateData()
  }
  getStateAbbr() {
    this.selectedAbbr = this.countryService.getstateName().find(element => element.name == this.State)

  }

  async getDistricts() {
    this.getStateAbbr()
    this.districtdata = await this.countryService.getdistrict(this.selectedAbbr?.abbreviation)

    this.districts = Object.keys(this.districtdata)
  }
  title = 'trip-planner';






}
