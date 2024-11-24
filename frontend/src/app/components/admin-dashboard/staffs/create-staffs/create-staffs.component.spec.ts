import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateStaffsComponent } from './create-staffs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StaffService } from '../../../../services/staff.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('CreateStaffComponent', () => {
  let component: CreateStaffsComponent;
  let fixture: ComponentFixture<CreateStaffsComponent>;
  let staffServiceMock: jasmine.SpyObj<StaffService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    staffServiceMock = jasmine.createSpyObj('StaffService', ['saveStaff', 'getSpecializations']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    staffServiceMock.saveStaff.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        CreateStaffsComponent
      ],
      providers: [
        { provide: StaffService, useValue: staffServiceMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStaffsComponent);
    component = fixture.componentInstance;

    component.optionListSpecs = [
      { label: 'Cardiology', value: '1' },
      { label: 'Neurology', value: '2' }
    ];

    component.optionListUsers = [
      { label: 'john.doe', value: 'john.doe' },
      { label: 'jane.smith', value: 'jane.smith' }
    ];

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Dialog visibility', () => {
    it('should display the dialog when visible is set to true', () => {
      component.visible = true;
      fixture.detectChanges();
      const dialogElement = fixture.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
    });
  });

  describe('Form validation', () => {
    it('should mark the form as invalid when required fields are empty', () => {
      component.staffFirstName = '';
      component.staffLastName = '';
      component.staffFullName = '';
      component.staffLicenseNumber = '';
      component.staffEmail = '';
      component.staffPhoneNumber = '';
      component.selectedSpecializations = '';
      component.selectedUsers = '';
      fixture.detectChanges();
      component.validateFields();
      expect(component.isFirstNameValid).toBeFalse();
      expect(component.isLastNameValid).toBeFalse();
      expect(component.isFullNameValid).toBeFalse();
      expect(component.isLicenseNumberValid).toBeFalse();
      expect(component.isSpecValid).toBeFalse();
      expect(component.isUserValid).toBeFalse();
    });

    it('should mark the form as valid when all required fields are filled', () => {
      component.staffFirstName = 'John';
      component.staffLastName = 'Doe';
      component.staffFullName = 'John Doe';
      component.staffLicenseNumber = '123456';
      component.staffEmail = 'john.doe@example.com';
      component.staffPhoneNumber = '912345678';
      component.selectedSpecializations = '1';
      component.selectedUsers = 'john.doe';
      fixture.detectChanges();
      component.validateFields();
      expect(component.isFirstNameValid).toBeTrue();
      expect(component.isLastNameValid).toBeTrue();
      expect(component.isFullNameValid).toBeTrue();
      expect(component.isLicenseNumberValid).toBeTrue();
      expect(component.isSpecValid).toBeTrue();
      expect(component.isUserValid).toBeTrue();
    });
  });

  it('should not call the service to save when the form is invalid', fakeAsync(() => {
    component.staffFirstName = '';
    component.saveStaff();
    tick();
    expect(staffServiceMock.saveStaff).not.toHaveBeenCalled();
  }));
  
  it('should not call saveStaff if no specializations are selected', fakeAsync(() => {
    component.selectedSpecializations = '';
    component.selectedUsers = 'john.doe';
    component.saveStaff();
    tick();
    expect(staffServiceMock.saveStaff).not.toHaveBeenCalled();
  }));

});
