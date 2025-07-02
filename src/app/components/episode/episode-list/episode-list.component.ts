import { ChangeDetectorRef, Component, inject, input } from "@angular/core";
import { CharacterService } from "../../../services/character.service";
import { EpisodeService } from "../../../services/episode.service";
import { LoaderService } from "../../../services/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { EpisodeApiResponse } from "../../../interfaces/episode-api-response";
import { ResponseError } from "../../../interfaces/response-error";
import { Episode } from "../../../interfaces/episode/episode";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-episode-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./episode-list.component.html",
  styleUrl: "./episode-list.component.css",
})
export class EpisodeListComponent {
  private characterService = inject(CharacterService);
  private episodeService = inject(EpisodeService);
  private loaderService = inject(LoaderService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  ////
  public totalPages: number = 0;

  public characterEpisodes = input<Array<Episode>>();
  public pagesArray: Array<Array<number>> = [];
  private pagesChunckSize: number = 6;

  public currentChunckIndex: number = 0;
  public currentPage: number = 1;

  public episodeList: Array<Episode> = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("ngoninit");
    if (!this.characterEpisodes()) {
      let routerPage =
        +this.activatedRoute.snapshot.queryParamMap.get("page")! || 1;
      //console.log("routerPage = ", routerPage);
      this.goToPage(routerPage);
    } else {
        this.episodeList = this.characterEpisodes()!;
        this.cdr.detectChanges();
      }
  }

  getAllChunkEpisodes(): void {
    this.episodeService.getAll(this.currentPage).subscribe({
      next: (res: EpisodeApiResponse) => {
        this.generatePages(res);

        this.episodeList = res.results;
      },
      error: (error: ResponseError) => {
        //console.log("response error = ", error);
      },
    });
  }

  generatePages(res: EpisodeApiResponse): void {
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

    this.currentChunckIndex =
      this.pagesArray.findIndex((pagesChunkArr) => {
        return pagesChunkArr.includes(this.currentPage);
      }) || 0;
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
    if (this.currentPage > 1) {
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

  goToPage(page: number): void {
    //if(this.currentPage != page){
    this.router.navigateByUrl("episode/list?page=" + page);
    this.currentPage = page;
    this.getAllChunkEpisodes();
    //}
  }

  goToEpisode(episode: Episode): void {
    this.router.navigate(["episode/" + episode.id], {
      state: { episode: episode },
    });
  }
}
