import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ProfileMenuComponent } from './profile-menu-component.component';
import { AuthModule } from '@auth0/auth0-angular';  // Importando o módulo Auth0
import { AuthService } from '@auth0/auth0-angular';

describe('ProfileMenuComponent', () => {
  let component: ProfileMenuComponent;
  let fixture: ComponentFixture<ProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileMenuComponent,
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
      ],
      providers: [AuthService]  // Fornecendo o AuthService
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
