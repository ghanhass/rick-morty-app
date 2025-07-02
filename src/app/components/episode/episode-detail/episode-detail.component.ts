import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EpisodeService } from '../../../services/episode.service';
import { LoaderService } from '../../../services/loader.service';
import { CharacterService } from '../../../services/character.service';
import { Episode } from '../../../interfaces/episode/episode';
import { CommonModule } from '@angular/common';
import { CharacterListComponent } from '../../character/characters-list/character-list.component';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [CommonModule, CharacterListComponent],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.css'
})
export class EpisodeDetailComponent {
  public id = signal("");
  
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private alertService = inject(AlertService);
    private episodeService = inject(EpisodeService);
    private loaderService = inject(LoaderService);
    private characterService = inject(CharacterService);
    currentEpisode: Episode|any ;
  
    public episodeCharacterIds: Array<string> = [];
  
    constructor(private cd: ChangeDetectorRef) {
      this.id.set(this.activatedRoute.snapshot.params["id"]);
      console.log("id = ", this.id());
    }
  
    ngOnInit(): void {
      this.episodeService.getOne(this.id()).subscribe({
        next: (res: Episode) => {
          this.currentEpisode = res;
  
          let charactersIdsArr = this.currentEpisode.characters.map((url: string)=>{
          let arr = url.split("/"); 
          let id = arr[arr.length-1]
          return id;
        });
  
        this.episodeCharacterIds = charactersIdsArr;
  
        this.cd.detectChanges();
        },
        error: (err) => {
          this.alertService.error(err.error);
        },
      });
    }
}
