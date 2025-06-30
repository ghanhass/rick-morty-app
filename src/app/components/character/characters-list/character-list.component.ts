import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
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

@Component({
  selector: "app-character-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./character-list.component.html",
  styleUrl: "./character-list.component.css",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CharactersListComponent implements OnInit {
  private characterService = inject(CharacterService);
  private locationService = inject(LocationService);
  private episodeService = inject(EpisodeService);
  private loaderService = inject(LoaderService);
  ////
  public totalPages: number = 0;

  public pagesArray: Array<Array<number>> = [];
  private pagesChunckSize: number = 6;

  public currentChunckIndex: number = 0;
  public currentPage: number = 1;

  public charactersList: Array<Character> = [];
  private loadedCharacterImagesCount: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.getAllChunkCharacters();
  }

  getAllCharactersChunkEpisodes(){
    this.loaderService.showLoader();
    let idsArr = this.charactersList.map((charac: Character)=>{
      return charac.episode; 
    }).flat(1).map((episodeUrl: string)=>{
      let arr = episodeUrl.split("/");
      let episodeId = arr[arr.length - 1];

      return episodeId;
    });

    idsArr = Array.from(new Set(idsArr));

    console.log("idsArr = ", idsArr);
    this.episodeService.getMultiple(idsArr).subscribe({
      next: (episodesList: Array<Episode>)=>{
        this.charactersList = this.charactersList.map((character: Character)=>{
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
    this.characterService.getAll(this.currentPage).subscribe({
      next: (res: CharacterApiResponse) => {
        this.generatePages(res);

        this.charactersList = res.results;

        this.getAllCharactersChunkEpisodes();

        //console.log("charactersList = ", this.charactersList);

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

      this.currentPage = nextPage;
    }

    this.getAllChunkCharacters();
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      let nextPage = this.currentPage - 1;

      if (!this.pagesArray[this.currentChunckIndex].includes(nextPage)) {
        this.currentChunckIndex--;
      }

      this.currentPage = nextPage;
    }

    this.getAllChunkCharacters();
  }

  onFirstPage(): void {
    this.currentChunckIndex = 0;
    this.currentPage = 1;

    this.getAllChunkCharacters();
  }

  onLastPage(): void {
    this.currentChunckIndex = this.pagesArray.length - 1;

    let lastPagesChunck: Array<number> =
    this.pagesArray[this.currentChunckIndex];
    this.currentPage = lastPagesChunck[lastPagesChunck.length - 1];

    this.getAllChunkCharacters();
  }

  goToPage(page: number) {
    if(this.currentPage != page){
      this.currentPage = page;
      this.getAllChunkCharacters();
    }
  }

  getOneCharacter(id: number): void {
    
  }

  onCharacterImageLoad($event: any){
    console.log("onCharacterImageLoad ev = ",$event);
    this.loadedCharacterImagesCount++;

    if(this.loadedCharacterImagesCount == this.charactersList.length){
      this.loadedCharacterImagesCount = 0;
      this.loaderService.hideLoader();
    }
  }
}
