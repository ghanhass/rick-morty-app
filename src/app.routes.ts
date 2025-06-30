import { Routes } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { CharactersListComponent } from './app/components/character/characters-list/character-list.component';
import { LocationListComponent } from './app/components/location/location-list/location-list.component';
import { EpisodeListComponent } from './app/components/episode/episode-list/episode-list.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: HomeComponent,
        //canActivate: [AuthGuardService],
      },
      {
        path: 'character-list',
        component: CharactersListComponent,
        //canActivate: [AuthGuardService],
      },
      {
        path: 'location-list',
        component: LocationListComponent,
        //canActivate: [AuthGuardService],
      },
      {
        path: 'episode-list',
        component: EpisodeListComponent,
        //canActivate: [AuthGuardService],
      }
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
