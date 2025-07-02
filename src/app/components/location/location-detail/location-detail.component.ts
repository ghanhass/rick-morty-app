import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EpisodeService } from '../../../services/episode.service';
import { LoaderService } from '../../../services/loader.service';
import { CharacterService } from '../../../services/character.service';
import { Character } from '../../../interfaces/character/character';
import { Location } from '../../../interfaces/location/location';
import { LocationService } from '../../../services/location.service';
import { CommonModule } from '@angular/common';
import { CharacterListComponent } from "../../character/characters-list/character-list.component";

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule, CharacterListComponent],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
public id = signal("");

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private episodeService = inject(EpisodeService);
  private locationService = inject(LocationService);
  private loaderService = inject(LoaderService);
  private characterService = inject(CharacterService);
  currentLocation: Location|any ;

  public locationResidentIds: Array<string> = [];

  constructor(private cd: ChangeDetectorRef) {
    this.id.set(this.activatedRoute.snapshot.params["id"]);
    console.log("id = ", this.id());
  }

  ngOnInit(): void {
    this.locationService.getOne(this.id()).subscribe({
      next: (res: Location) => {
        this.currentLocation = res;

        let residentsIdsArr = this.currentLocation.residents.map((url: string)=>{
        let arr = url.split("/"); 
        let id = arr[arr.length-1]
        return id;
      });

      this.locationResidentIds = residentsIdsArr;

      this.cd.detectChanges();
      },
      error: (err) => {
        this.alertService.error(err.error);
      },
    });
  }
}
