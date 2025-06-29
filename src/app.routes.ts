import { Routes } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { CharactersListComponent } from './app/characters-list/characters-list.component';

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
        path: 'characters-list',
        component: CharactersListComponent,
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
