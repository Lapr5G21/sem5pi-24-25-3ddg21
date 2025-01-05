import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CreateRoomTypesComponent } from './create-room-types.component';
import { RoomTypeService } from '../../../../services/room-type.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

describe('CreateRoomTypesComponent', () => {
  let component: CreateRoomTypesComponent;
  let fixture: ComponentFixture<CreateRoomTypesComponent>;
  let roomTypeService: jasmine.SpyObj<RoomTypeService>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const roomTypeServiceSpy = jasmine.createSpyObj('RoomTypeService', ['saveRoomType']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CreateRoomTypesComponent],
      providers: [
        { provide: RoomTypeService, useValue: roomTypeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRoomTypesComponent);
    component = fixture.componentInstance;
    roomTypeService = TestBed.inject(RoomTypeService) as jasmine.SpyObj<RoomTypeService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateFields', () => {
    it('should validate fields correctly', () => {
      component.Code = '';
      component.Designation = '';
      component.validateFields();
      expect(component.isCodeValid).toBeFalse();
      expect(component.isDesignationValid).toBeFalse();

      component.Code = 'ValidCode';
      component.Designation = 'ValidDesignation';
      component.validateFields();
      expect(component.isCodeValid).toBeTrue();
      expect(component.isDesignationValid).toBeTrue();
    });
  });

  describe('saveRoomType', () => {
    it('should not save when fields are invalid', () => {
      component.Code = '';
      component.Designation = '';
      component.IsSuitableForSurgery = null;
      component.saveRoomType();

      expect(component.isSubmitted).toBeTrue();
      expect(roomTypeService.saveRoomType).not.toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form fields', () => {
      component.Code = 'Code';
      component.Designation = 'Designation';
      component.Description = 'Description';
      component.IsSuitableForSurgery = true;

      component.resetForm();

      expect(component.Code).toBe('');
      expect(component.Designation).toBe('');
      expect(component.Description).toBe('');
      expect(component.IsSuitableForSurgery).toBeNull();
      expect(component.isSubmitted).toBeFalse();
    });
  });

  describe('adjustTextarea', () => {
    it('should adjust textarea height dynamically', () => {
      const event = {
        target: {
          style: { height: '0px' },
          scrollHeight: 50
        }
      } as unknown as Event;
    
      const target = event.target as HTMLTextAreaElement | null;
      if (target) {
        component.adjustTextarea(event);
        expect(target.style.height).toBe('50px');
      } else {
        fail('event.target is null');
      }
    });    
  });
});
