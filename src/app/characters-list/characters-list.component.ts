import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { CharacterService } from "../services/character.service";
import { Character } from "../interfaces/character/character";
import { ResponseError } from "../interfaces/response-error";
import { CharacterApiResponse } from "../interfaces/character-api-response";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-characters-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./characters-list.component.html",
  styleUrl: "./characters-list.component.css",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CharactersListComponent implements OnInit {
  private characterService = inject(CharacterService);
  ////
  public totalPages: number = 0;

  public pagesArray: Array<Array<number>> = [];
  private pagesChunckSize: number = 6;

  public currentChunckIndex: number = 0;
  public currentPage: number = 1;

  public charactersList: Array<Character> = [];

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.getAllCharacters();
  }

  getAllCharacters(): void {
    this.characterService.getAll(this.currentPage).subscribe({
      next: (res: CharacterApiResponse) => {
        this.generatePages(res);

        this.charactersList = res.results;
        this.cdr.detectChanges();
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

    this.getAllCharacters();
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      let nextPage = this.currentPage - 1;

      if (!this.pagesArray[this.currentChunckIndex].includes(nextPage)) {
        this.currentChunckIndex--;
      }

      this.currentPage = nextPage;
    }

    this.getAllCharacters();
  }

  onFirstPage(): void {
    this.currentChunckIndex = 0;
    this.currentPage = 1;

    this.getAllCharacters();
  }

  onLastPage(): void {
    this.currentChunckIndex = this.pagesArray.length - 1;

    let lastPagesChunck: Array<number> =
    this.pagesArray[this.currentChunckIndex];
    this.currentPage = lastPagesChunck[lastPagesChunck.length - 1];

    this.getAllCharacters();
  }

  goToPage(page: number) {
    if(this.currentPage != page){
      this.currentPage = page;
      this.getAllCharacters();
    }
  }

  getOneCharacter(id: number): void {
    
  }
}
