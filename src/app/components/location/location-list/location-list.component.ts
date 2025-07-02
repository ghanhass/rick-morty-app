import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CharacterService } from '../../../services/character.service';
import { LocationService } from '../../../services/location.service';
import { EpisodeService } from '../../../services/episode.service';
import { LoaderService } from '../../../services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../../interfaces/character/character';
import { LocationApiResponse } from '../../../interfaces/location-api-response';
import { Location } from '../../../interfaces/location/location';
import { ResponseError } from '../../../interfaces/response-error';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.css'
})
export class LocationListComponent {

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
  
    public locationList: Array<Location> = [];  
  
    constructor(private cdr: ChangeDetectorRef) {
      
    }
    
    ngOnInit(): void {
      console.log("ngoninit")
      let routerPage = +this.activatedRoute.snapshot.queryParamMap.get("page")! || 1;
            //console.log("routerPage = ", routerPage);
            this.goToPage(routerPage);        
    }
  

    getAllChunkLocations(): void {
      this.locationService.getAll(this.currentPage).subscribe({
        next: (res: LocationApiResponse) => {
          this.generatePages(res);
  
          this.locationList = res.results;
        },
        error: (error: ResponseError) => {
          //console.log("response error = ", error);
        },
      });
    }
  
    generatePages(res: LocationApiResponse): void {
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
  
      let lastPagesChunck: Array<number> = this.pagesArray[this.currentChunckIndex];
      let lastPage = lastPagesChunck[lastPagesChunck.length - 1];
  
      this.goToPage(lastPage);
    }
  
    goToPage(page: number):void {
      //if(this.currentPage != page){
        this.router.navigateByUrl("location/list?page="+page);
        this.currentPage = page;
        this.getAllChunkLocations();
      //}
    }
  
    goToLocation(location: Location):void{
      this.router.navigate(["location/"+location.id],{
        state: {location: location}
      });
    }

}
