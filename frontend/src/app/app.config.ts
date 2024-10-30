import { ApplicationConfig } from '@angular/core';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-teie1lfprp6bjr5x.us.auth0.com',
      clientId: 'bf7tb9s9cJr7AVClgLgDKg4r0uGJ8c1m',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
};
