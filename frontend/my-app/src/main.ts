import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'zone.js';  // 👈 keep this line

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideTranslateService, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './app/interceptors/auth-interceptor';

// --- Your existing logging interceptor ---
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}

// --- Bootstrap configuration ---
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor, AuthInterceptor])),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      })
    }),
  ]
}).catch((err) => console.error(err));
