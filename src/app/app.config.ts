import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {provideAnimations} from "@angular/platform-browser/animations";

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NetworkInterceptor } from './interceptors/network.interceptor';
import { GestErrorInterceptor } from './interceptors/gest-error.interceptor';

/*
  withViewTransitions -> serve per abilitare le animazioni di entrata e uscita dalle pagine
                         vedere lo style.css in cui è inserito lo stile dell'animazione
*/

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GestErrorInterceptor,
      multi: true
    }
  ]
};
