import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationApiResponse } from '../interfaces/location-api-response';
import { Location } from '../interfaces/location/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private httpClient = inject(HttpClient);

  private url = "https://rickandmortyapi.com/api/location";
  constructor() { }

  getAll(page: number):Observable<LocationApiResponse>{
    return this.httpClient.get<LocationApiResponse>(this.url+"?page="+page,{reportProgress: true});
  }

  getOne(locationId: number | string): Observable<Location> {
      return this.httpClient.get<Location>(this.url + "/" + locationId)
    }

  getMultiple(locationIdsArr: Array<number>):Observable<Array<Location>>{
    let paramsStr = locationIdsArr.map(el => el+"").join(",");
    return this.httpClient.get<Array<Location>>(this.url+"/"+paramsStr);
  }

}
