import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private apiCall: ApiCallService) { }
  stateNames = [
    { abbreviation: "AN", name: "Andaman and Nicobar Islands" },
    { abbreviation: "AP", name: "Andhra Pradesh" },
    { abbreviation: "AR", name: "Arunachal Pradesh" },
    { abbreviation: "AS", name: "Assam" },
    { abbreviation: "BR", name: "Bihar" },
    { abbreviation: "CH", name: "Chandigarh" },
    { abbreviation: "CT", name: "Chhattisgarh" },
    { abbreviation: "DL", name: "Delhi" },
    { abbreviation: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { abbreviation: "GA", name: "Goa" },
    { abbreviation: "GJ", name: "Gujarat" },
    { abbreviation: "HP", name: "Himachal Pradesh" },
    { abbreviation: "HR", name: "Haryana" },
    { abbreviation: "JH", name: "Jharkhand" },
    { abbreviation: "JK", name: "Jammu and Kashmir" },
    { abbreviation: "KA", name: "Karnataka" },
    { abbreviation: "KL", name: "Kerala" },
    { abbreviation: "LA", name: "Ladakh" },
    { abbreviation: "LD", name: "Lakshadweep" },
    { abbreviation: "MH", name: "Maharashtra" },
    { abbreviation: "ML", name: "Meghalaya" },
    { abbreviation: "MN", name: "Manipur" },
    { abbreviation: "MP", name: "Madhya Pradesh" },
    { abbreviation: "MZ", name: "Mizoram" },
    { abbreviation: "NL", name: "Nagaland" },
    { abbreviation: "OR", name: "Odisha" },
    { abbreviation: "PB", name: "Punjab" },
    { abbreviation: "PY", name: "Puducherry" },
    { abbreviation: "RJ", name: "Rajasthan" },
    { abbreviation: "SK", name: "Sikkim" },
    { abbreviation: "TG", name: "Telangana" },
    { abbreviation: "TN", name: "Tamil Nadu" },
    { abbreviation: "TR", name: "Tripura" },
    { abbreviation: "TT", name: "State name not available" }, // Placeholder as TT is not a recognized state abbreviation
    { abbreviation: "UP", name: "Uttar Pradesh" },
    { abbreviation: "UT", name: "Uttarakhand" }
  ];

  getstateName(): { abbreviation: string, name: string }[] {
    return this.stateNames.map((item) => item)

  }

  getstateAbbr(state: string): string | undefined{
       const statesel = this.stateNames.find((item) => item.name == state)
        return statesel?.abbreviation
  }

  private stateSubject = new BehaviorSubject<string | undefined>(undefined);
  state$ = this.stateSubject.asObservable();

  setState(state: string | undefined): void {
    this.stateSubject.next(state);
  }

  getState(): string | undefined {
    return this.stateSubject.getValue();
  }

  private deltaSubject = new BehaviorSubject<string | undefined>(undefined);
  delta$ = this.deltaSubject.asObservable()

  setDellta(delta: string | undefined): void {
    this.deltaSubject.next(delta);
  }

  getDelta(): string | undefined {
    return this.deltaSubject.getValue();
  }


   getdistrict(state: string | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiCall.getAlldata().subscribe((item) => {
        if (item.hasOwnProperty(state)) {
          const stateData = item[state!];
          resolve(stateData.districts);
        } else {
          reject(`State ${state} not found`);
        }
      }, (error) => {
        reject(error);
      });
    });
  }
  async getselectedStateData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiCall.getAlldata().subscribe(
        (item) => {
          let found = false;
          for (const key in item) {
            if (key === this.getselectedState()) {
              resolve(item[key]);
              found = true;
              break;
            }
          }
          if (!found) {
            reject('State not found');
          }
        },
        (error:Error) => {
          reject('Error fetching data: ' + error);
        }
      );
    });
  }
  
getselectedState():string | undefined{
  let result: string | undefined
  this.state$.subscribe((data)=>{
 result = data

    });
    return result
  }
  
}
