import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAccountComponent } from './patient-account-component.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PatientAccountComponent', () => {
  let component: PatientAccountComponent;
  let fixture: ComponentFixture<PatientAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAccountComponent,BrowserAnimationsModule,
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
