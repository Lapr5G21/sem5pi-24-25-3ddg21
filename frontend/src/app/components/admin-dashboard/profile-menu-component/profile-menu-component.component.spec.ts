import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMenuComponentComponent } from './profile-menu-component.component';

describe('ProfileMenuComponentComponent', () => {
  let component: ProfileMenuComponentComponent;
  let fixture: ComponentFixture<ProfileMenuComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMenuComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMenuComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
