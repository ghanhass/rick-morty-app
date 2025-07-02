import { Routes } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { CharacterListComponent } from './app/components/character/characters-list/character-list.component';
import { LocationListComponent } from './app/components/location/location-list/location-list.component';
import { EpisodeListComponent } from './app/components/episode/episode-list/episode-list.component';
import { CharacterDetailComponent } from './app/components/character/character-detail/character-detail.component';
import { LocationDetailComponent } from './app/components/location/location-detail/location-detail.component';
import { EpisodeDetailComponent } from './app/components/episode/episode-detail/episode-detail.component';

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
        
      },
      {
        path: 'character',
        children:[
          {
            path: 'list',
            component: CharacterListComponent,
          },
          {
            path: ':id',
            component: CharacterDetailComponent,
          },
        ]
      },
      {
        path: 'location',
        children:[
          {
            path: 'list',
            component: LocationListComponent,
          },
          {
            path: ':id',
            component: LocationDetailComponent,
          },
        ]
      },
      {
        path: 'episode',
        children:[
          {
            path: 'list',
            component: EpisodeListComponent,
          },
          {
            path: ':id',
            component: EpisodeDetailComponent,
          },
        ]
      },
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
