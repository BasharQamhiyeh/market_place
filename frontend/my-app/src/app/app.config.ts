import { 
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { provideTranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),

    // ✅ Modern ngx-translate v17 setup — no loader factory needed
    provideTranslateService({
      lang: 'en',        // default language
      fallbackLang: 'en'
    }),
    provideBrowserGlobalErrorListeners()
  ]
};
