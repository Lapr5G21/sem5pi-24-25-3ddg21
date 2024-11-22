import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

describe('DoctorDashboardComponent', () => {
  let component: DoctorDashboardComponent;
  let fixture: ComponentFixture<DoctorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDashboardComponent, HttpClientModule],
      providers: [
        { 
          provide: AuthService, 
          useValue: { 
            isAuthenticated$: of(true), // Mockar o valor que você precisa
            loginWithRedirect: jasmine.createSpy(), 
            logout: jasmine.createSpy() 
          } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
