import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SurgeryRoomService } from '../../../../services/surgery-room.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateSurgeryRoomDto } from '../../../../domain/surgery-room-model';
import { ToastModule } from 'primeng/toast';


enum Status
{
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    UNDER_MAINTENANCE = 'UNDER_MAINTENANCE'
}


@Component({
    selector: 'create-surgery-rooms-modal',
    templateUrl: './create-surgery-rooms.component.html',
    styleUrls: ['./create-surgery-rooms.component.scss'],
    standalone: true,
    imports: [
        DialogModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
        FormsModule,
        CommonModule,
        HttpClientModule,
        ToastModule,
    ],
    providers: [SurgeryRoomService, MessageService]
})
export class CreateSurgeryRoomsComponent {
  visible: boolean = false;

  Id: string = '';
  RoomTypeCode: string = '';
  RoomCapacity: number = 0;
  MaintenanceSlots: string = '';
  Equipment: string = '';
  Status: string = '';
  
  StatusOptions : SelectItem[] = [
          { label: 'AVAILABLE', value: Status.AVAILABLE },
          { label: 'OCCUPIED', value: Status.OCCUPIED },
          { label: 'UNDER_MAINTENANCE', value: Status.UNDER_MAINTENANCE }
      ];
  
  isNumberValid: boolean = true;
  isRoomTypeCodeValid: boolean = true;
  isCapacityValid: boolean = true;
  isMaintenanceSlotsValid: boolean = true;
  isEquipmentValid: boolean = true;
  isStatusValid: boolean = true;
  
  isSubmitted: boolean = false;
  

    constructor(
        private surgeryRoomService: SurgeryRoomService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.visible = true;
    }

    saveSurgeryRoom() {
      this.isSubmitted = true;
      this.validateFields();
  
      if (
          this.isNumberValid &&
          this.isRoomTypeCodeValid &&
          this.isCapacityValid &&
          this.isMaintenanceSlotsValid &&
          this.isEquipmentValid &&
          this.isStatusValid
      ) {
          const surgeryRoom = new CreateSurgeryRoomDto(
              this.Id,
              this.RoomTypeCode,
              this.RoomCapacity,
              this.MaintenanceSlots,
              this.Equipment,
              this.Status
          );

          console.log('Surgery Room Object:', surgeryRoom); // Verifique o que está sendo enviado
  
          console.log('Payload:', JSON.stringify(surgeryRoom));
  
          this.surgeryRoomService.saveSurgeryRoom(surgeryRoom).subscribe(
              () => {
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Surgery Room Successfully Saved!'
                  });
                  this.resetForm();
                  this.visible = false;
                  this.isSubmitted = false;
                  setTimeout(() => {
                      window.location.reload();
                  }, 500);
              },
              (error) => {
                  console.error('Surgery Room Saving Error:', error);
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'The surgery room could not be saved'
                  });
              }
          );
      }
  }
  
  validateFields() {
      this.isNumberValid = !!this.Id;
      this.isRoomTypeCodeValid = !!this.RoomTypeCode;
      this.isCapacityValid = this.RoomCapacity > 0;
      this.isMaintenanceSlotsValid = this.MaintenanceSlots !== null;
      this.isEquipmentValid = !!this.Equipment;
      this.isStatusValid = !!this.Status;
  }
  
  resetForm() {
      this.Id = '';
      this.RoomTypeCode = '';
      this.RoomCapacity = 0;
      this.MaintenanceSlots = '';
      this.Equipment = '';
      this.Status = '';
      this.isNumberValid = true;
      this.isRoomTypeCodeValid = true;
      this.isCapacityValid = true;
      this.isMaintenanceSlotsValid = true;
      this.isEquipmentValid = true;
      this.isStatusValid = true;
      this.isSubmitted = false;
  }
  
  

}

