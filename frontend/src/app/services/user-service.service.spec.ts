import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service.service';
import { AuthModule } from '@auth0/auth0-angular';  // Importando o módulo Auth0
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
      AuthModule.forRoot({
          domain: 'dev-teie1lfprp6bjr5x.us.auth0.com',
          clientId: 'bf7tb9s9cJr7AVClgLgDKg4r0uGJ8c1m',
  
          authorizationParams: {
      redirect_uri: 'http://localhost:4200/auth-callback',
      cacheLocation: 'localstorage',
      audience: 'https://api.healthcaresystem',
  
      scope: 'openid profile email'  
    }
  })
      ] 
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
