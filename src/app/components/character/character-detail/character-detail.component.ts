import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Character } from "../../../interfaces/character/character";
import { AlertService } from "../../../services/alert.service";
import { CommonModule } from "@angular/common";
import { LoaderService } from "../../../services/loader.service";
import { CharacterService } from "../../../services/character.service";
import { EpisodeService } from "../../../services/episode.service";
import { Episode } from "../../../interfaces/episode/episode";
import { EpisodeListComponent } from "../../episode/episode-list/episode-list.component";

@Component({
  selector: "app-character-detail",
  standalone: true,
  imports: [CommonModule, EpisodeListComponent],
  templateUrl: "./character-detail.component.html",
  styleUrl: "./character-detail.component.css",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CharacterDetailComponent implements OnInit {
  public id = signal("");

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private episodeService = inject(EpisodeService);
  private loaderService = inject(LoaderService);
  private characterService = inject(CharacterService);
  currentCharacter: Character|any ;
  characterEpisodes: Episode[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.id.set(this.activatedRoute.snapshot.params["id"]);
    console.log("id = ", this.id());
  }

  ngOnInit(): void {
    this.characterService.getOne(this.id()).subscribe({
      next: (res: Character) => {
        this.currentCharacter = res;

        let episodeIdsArr = [res.episode].flat().map((episodeUrl: string) => {
          let arr = episodeUrl.split("/");
          let episodeId = arr[arr.length - 1];

          return episodeId;
        });

        episodeIdsArr = Array.from(new Set(episodeIdsArr));

        this.episodeService.getMultiple(episodeIdsArr).subscribe({
          next: (episodeList) => {
            let firstEpUrl: string = this.currentCharacter.episode[0];
            
            this.characterEpisodes = [episodeList].flat();
            
            this.currentCharacter.firstEpisodeName =
              [episodeList].flat().find((episode: Episode) => {
                return episode.url == firstEpUrl;
              })?.name || "";
          },
        });

        this.cd.detectChanges();
      },
      error: (err) => {
        this.alertService.error(err.error);
      },
    });
  }
}
