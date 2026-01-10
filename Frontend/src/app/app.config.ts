import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideSweetAlert2} from '@sweetalert2/ngx-sweetalert2';
import {FormsModule} from '@angular/forms';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(FormsModule),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: true
        }
      },
      ripple: true
    })

  ]
};
