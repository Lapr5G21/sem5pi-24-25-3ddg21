import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAuth0({
      domain: 'dev-teie1lfprp6bjr5x.us.auth0.com',       
      clientId: 'bf7tb9s9cJr7AVClgLgDKg4r0uGJ8c1m', 
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }), provideAnimationsAsync(),
  ],
};