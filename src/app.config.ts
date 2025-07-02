import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { httpProgressInterceptor } from './app/services/http-progress.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    importProvidersFrom(
      RouterModule.forRoot(APP_ROUTES, { bindToComponentInputs: true })
    ),
    provideHttpClient(withInterceptors([httpProgressInterceptor]))
  ],
};
