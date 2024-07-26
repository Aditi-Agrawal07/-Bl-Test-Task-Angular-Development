import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient) { }

  getAlldata():Observable<any>{
return this.http.get("https://data.covid19india.org/v4/min/data.min.json")
  }
}
