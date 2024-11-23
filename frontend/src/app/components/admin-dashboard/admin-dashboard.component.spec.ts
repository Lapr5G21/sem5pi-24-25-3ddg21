import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent,
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

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
