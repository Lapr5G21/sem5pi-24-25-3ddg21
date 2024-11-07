import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      DropdownModule,
      HttpClientModule,
      RouterModule.forRoot(routes),
      AuthModule.forRoot({
        domain: 'dev-teie1lfprp6bjr5x.us.auth0.com',
  clientId: 'bf7tb9s9cJr7AVClgLgDKg4r0uGJ8c1m',

  authorizationParams: {
    redirect_uri: 'http://localhost:4200/auth-callback',
    cacheLocation: 'localstorage',
    audience: 'https://dev-teie1lfprp6bjr5x.us.auth0.com/api/v2/',

    scope: 'read:current_user',
  }
})
    )
]
}).catch(err => console.error(err));
