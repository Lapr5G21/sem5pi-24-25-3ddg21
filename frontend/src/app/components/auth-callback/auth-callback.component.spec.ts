import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCallbackComponent } from './auth-callback.component';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthCallbackComponent], 
      imports: [
        AuthModule.forRoot({
          domain: 'dev-teie1lfprp6bjr5x.us.auth0.com',
          clientId: 'bf7tb9s9cJr7AVClgLgDKg4r0uGJ8c1m',
          authorizationParams: {
            redirect_uri: 'http://localhost:4200/auth-callback',
            cacheLocation: 'localstorage',
            audience: 'https://api.healthcaresystem',
            scope: 'openid profile email',
          },
        }), HttpClientModule
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
