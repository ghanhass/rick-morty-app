import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { CharacterService } from "../../../services/character.service";
import { Character } from "../../../interfaces/character/character";
import { ResponseError } from "../../../interfaces/response-error";
import { CharacterApiResponse } from "../../../interfaces/character-api-response";
import { CommonModule } from "@angular/common";
import { LocationService } from "../../../services/location.service";
import { Location } from "../../../interfaces/location/location";
import { EpisodeService } from "../../../services/episode.service";
import { Episode } from "../../../interfaces/episode/episode";
import { LoaderService } from "../../../services/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";

@Component({
  selector: "app-character-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./character-list.component.html",
  styleUrl: "./character-list.component.css",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CharacterListComponent implements OnInit {
  private characterService = inject(CharacterService);
  private locationService = inject(LocationService);
  private episodeService = inject(EpisodeService);
  private loaderService = inject(LoaderService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  ////
  public totalPages: number = 0;

  public pagesArray: Array<Array<number>> = [];
  private pagesChunckSize: number = 6;

  public currentChunckIndex: number = 0;
  public currentPage: number = 1;

  public characterList: Array<Character> = [];
  private loadedCharacterImagesCount: number = 0;


  locationResidentIds = input<Array<string>>();
  episodeCharacterIds = input<Array<string>>();

  constructor(private cdr: ChangeDetectorRef) {
    
  }
  
  ngOnInit(): void {
    console.log("ngoninit")
    let routerPage = +this.activatedRoute.snapshot.queryParamMap.get("page")! || 1;
          //console.log("routerPage = ", routerPage);
          this.goToPage(routerPage);        
  }

  getAllCharactersChunkEpisodes(): void{
    this.loaderService.showLoader();
    let episodeIdsArr = this.characterList.map((charac: Character)=>{
      return charac.episode; 
    }).flat(1).map((episodeUrl: string)=>{
      let arr = episodeUrl.split("/");
      let episodeId = arr[arr.length - 1];

      return episodeId;
    });

    episodeIdsArr = Array.from(new Set(episodeIdsArr));

    //console.log("episodeIdsArr = ", episodeIdsArr);
    this.episodeService.getMultiple(episodeIdsArr).subscribe({
      next: (episodesList: Array<Episode>)=>{
        this.characterList = this.characterList.map((character: Character)=>{
          let obj = character;
          let firstEpUrl: string = character.episode[0];

          //using [episodesList].flat() to force  getting a array of a single object if the api returns a single episode, rather than an array of episodes
          obj.firstEpisodeName = ([episodesList].flat()).find((episode: Episode)=>{
            return episode.url == firstEpUrl
          })?.name || "";

          return obj;
        });
        this.cdr.detectChanges();
      }
    })
  }
  getAllChunkCharacters(): void {
    let obs: any;
    if(this.locationResidentIds()){
      console.log("AAA");
      obs = this.characterService.getMultiple(this.locationResidentIds()!).pipe(map((res)=>{
        return {
          results: [res].flat(),
        }
      }));
    }
    else if(this.episodeCharacterIds()){
      obs = this.characterService.getMultiple(this.episodeCharacterIds()!).pipe(map((res)=>{
        return {
          results: [res].flat(),
        }
      }));
    }
    else{
      console.log("BBB");
      obs = this.characterService.getAll(this.currentPage);
    }


    obs.subscribe({
      next: (res: any) => {
        console.log("res = ",res);
        console.log("this.locationResidentIds = ",this.locationResidentIds());
        if(!this.locationResidentIds() && !this.episodeCharacterIds()){
          this.generatePages(res);
        }

          this.characterList = res.results;

    

        this.getAllCharactersChunkEpisodes();

        //console.log("characterList = ", this.characterList);

        //end preparing pages numbers
      },
      error: (error: ResponseError) => {
        //console.log("response error = ", error);
      },
    });
  }

  generatePages(res: CharacterApiResponse): void {
    this.totalPages = res.info.pages;
    //this.totalPages = 55; //test
    let arr = [];
    //start preparing pages numbers
    for (let ind = 1; ind <= this.totalPages; ind++) {
      arr.push(ind);
      if (ind % this.pagesChunckSize === 0 || ind === this.totalPages) {
        this.pagesArray.push(arr);
        arr = [];
      }
    }

    this.currentChunckIndex = this.pagesArray.findIndex((pagesChunkArr)=>{
      return pagesChunkArr.includes(this.currentPage);
    }) || 0
    //console.log("this.pagesArray = ", this.pagesArray);
  }

  getCurrentPagesChunck(): Array<number> {
    let arr = this.pagesArray[this.currentChunckIndex];

    return arr;
  }

  onNextPage(): void {
    let lastChunckIndex = this.pagesArray.length - 1;

    let lastPagesChunck: Array<number> = this.pagesArray[lastChunckIndex];
    let lastPage: number = lastPagesChunck[lastPagesChunck.length - 1];

    let nextPage = this.currentPage + 1;
    if (nextPage <= lastPage) {
      if (!this.pagesArray[this.currentChunckIndex].includes(nextPage)) {
        this.currentChunckIndex++;
      }

      this.goToPage(nextPage);
    }
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      let nextPage = this.currentPage - 1;

      if (!this.pagesArray[this.currentChunckIndex].includes(nextPage)) {
        this.currentChunckIndex--;
      }

      this.goToPage(nextPage);
    }
  }

  onFirstPage(): void {
      if(this.currentPage > 1){
        this.currentChunckIndex = 0;
      this.goToPage(1);
      }
    }

  onLastPage(): void {
    this.currentChunckIndex = this.pagesArray.length - 1;

    let lastPagesChunck: Array<number> =
    this.pagesArray[this.currentChunckIndex];
    let lastPage = lastPagesChunck[lastPagesChunck.length - 1];

    this.goToPage(lastPage);
  }

  goToPage(page: number):void {
    //if(this.currentPage != page){
    if(!this.locationResidentIds() && !this.episodeCharacterIds()){
      this.router.navigateByUrl("character/list?page="+page);
    }

      this.currentPage = page;
      this.getAllChunkCharacters();
    //}
  }

  goToCharacter(character: Character):void{
    this.router.navigate(["character/"+character.id],{
      state: {character: character}
    });
  }

  onCharacterImageLoad($event: any): void{
    //console.log("onCharacterImageLoad ev = ",$event);
    this.loadedCharacterImagesCount++;

    if(this.loadedCharacterImagesCount == this.characterList.length){
      this.loadedCharacterImagesCount = 0;
      this.loaderService.hideLoader();
    }
  }
}
