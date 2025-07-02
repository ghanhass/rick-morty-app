import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { concatMap, map, mergeMap, Observable, switchMap } from "rxjs";
import { Character } from "../interfaces/character/character";
import { CharacterApiResponse } from "../interfaces/character-api-response";

@Injectable({
  providedIn: "root",
})
export class CharacterService {
  private httpClient = inject(HttpClient);

  private url = "https://rickandmortyapi.com/api/character";
  constructor() {}

  getAll(page: number): Observable<CharacterApiResponse> {
    return this.httpClient.get<CharacterApiResponse>(
      this.url + "?page=" + page,
      { reportProgress: true }
    );
  }

  getOne(characterId: number | string): Observable<Character> {
    return this.httpClient.get<Character>(this.url + "/" + characterId)
  }

  getMultiple(characterIdsArr: Array<number|string>): Observable<Array<Character>> {
    let paramsStr = characterIdsArr.map((el) => el + "").join(",");
    console.log("paramStr = ", paramsStr);
    return this.httpClient.get<Array<Character>>(this.url + "/" + paramsStr);
  }
}
