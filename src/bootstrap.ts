import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/components/app-component/app-component';
import { appConfig } from './app.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig);
