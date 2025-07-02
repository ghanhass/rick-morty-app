import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EpisodeApiResponse } from '../interfaces/episode-api-response';
import { Episode } from '../interfaces/episode/episode';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  private httpClient = inject(HttpClient);

  private url = "https://rickandmortyapi.com/api/episode";
  constructor() { }

  getAll(page: number):Observable<EpisodeApiResponse>{
    return this.httpClient.get<EpisodeApiResponse>(this.url+"?page="+page,{reportProgress: true});
  }

  getOne(episodeId: number | string): Observable<Episode> {
        return this.httpClient.get<Episode>(this.url + "/" + episodeId);
      }

  getMultiple(episodeIdsArr: Array<number|string>):Observable<Array<Episode>>{
    let paramsStr = episodeIdsArr.map(el => el+"").join(",");
    return this.httpClient.get<Array<Episode>>(this.url+"/"+paramsStr);
  }

}
