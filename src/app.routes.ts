import { Routes } from '@angular/router';
import { DashboardComponent } from './app/dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        //canActivate: [AuthGuardService],
      }
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
