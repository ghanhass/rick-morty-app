import { Component, inject, OnInit } from '@angular/core';
import { CharacterService } from '../services/character.service';
import { Character } from '../interfaces/character/character';
import { ResponseError } from '../interfaces/response-error';
import { CharacterApiResponse } from '../interfaces/character-api-response';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.css'
})
export class CharactersListComponent implements OnInit{
    private characterService = inject(CharacterService);
    ////
    public totalPages: number = 0;
    public currentPage: number = 1;
    public pagesArray: Array<Array<number>> = [];
    private PagesChunckSize: number = 2;

    public charactersList: Array<Character> = [];

    ngOnInit(): void {
      this.getAllCharacters();
    }

    getAllCharacters(): void{
      this.characterService.getAll(this.currentPage).subscribe({
          next: (res: CharacterApiResponse)=>{

            this.generatePages(res);

            this.charactersList = res.results;
            console.log("charactersList = ", this.charactersList);

            
            //end preparing pages numbers
          },
          error: (error: ResponseError)=>{
            console.log("response error = ", error);
          }
        });
    }

    generatePages(res: CharacterApiResponse): void{
      this.totalPages = res.info.pages;
      //this.totalPages = 55; //test
      let pagesDivisionsNumber: number = Math.ceil(this.totalPages/this.PagesChunckSize);
      let arr = [];
      //start preparing pages numbers
      for(let ind = 1; ind <= this.totalPages; ind++){
        arr.push(ind);
        if(ind % this.PagesChunckSize === 0 || ind === this.totalPages){
          this.pagesArray.push(arr);
          arr = [];
        }
      }
      console.log("this.pagesArray = ", this.pagesArray);
    }

    getOneCharacter(id: number):void{

    }
}