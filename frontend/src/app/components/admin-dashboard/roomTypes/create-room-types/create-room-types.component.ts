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
import { RoomTypeService } from '../../../../services/room-type.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateRoomTypeDto, RoomType } from '../../../../domain/roomType-model';
import { ToastModule } from 'primeng/toast';


@Component({
    selector: 'create-room-types-modal',
    templateUrl: './create-room-types.component.html',
    styleUrls: ['./create-room-types.component.scss'],
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
    providers: [RoomTypeService, MessageService]
})
export class CreateRoomTypesComponent {
    visible: boolean = false;

    Code: string = '';
    Designation: string = '';
    Description: string = '';
    SurgerySuitability: boolean | null = null;
    surgerySuitabilityOptions = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];
    
    isCodeValid: boolean = true;
    isDesignationValid: boolean = true;

    isSubmitted: boolean = false;

    constructor(
        private roomTypeService: RoomTypeService,
        private messageService: MessageService
    ) {}

  
    
    showDialog() {
        this.visible = true;
    }

    saveRoomType() {
        this.isSubmitted = true;
        this.validateFields();

        if (this.isCodeValid && this.isDesignationValid && this.SurgerySuitability !== null) {
                
            const roomType = new CreateRoomTypeDto(
            this.Code,
            this.Designation,
            this.Description,
            this.SurgerySuitability
        );

        console.log('Payload:', JSON.stringify(roomType));

        this.roomTypeService.saveRoomType(roomType).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Room Type Successfully Saved!'
                });
                this.resetForm();
                this.visible = false;
                this.isSubmitted = false;
                setTimeout(() => {
                    window.location.reload();
                }, 500); 
            },
            (error) => {
                console.error('PatRoom Type Saving Error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'The room type could not be saved'
                });
            }
        );
    }
    }
    
    
    adjustTextarea(event: Event): void {
      const textarea = event.target as HTMLTextAreaElement;
      textarea.style.height = 'auto'; // Redefine a altura para calcular o novo tamanho
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para o tamanho do conteúdo
    }


    
    validateFields() {
        this.isCodeValid = !!this.Code;
        this.isDesignationValid = !!this.Designation;
    }


    
    resetForm() {
        this.Code = '';
        this.Designation = '';
        this.Description = '';
        this.SurgerySuitability = null;
        this.isCodeValid = true;
        this.isDesignationValid = true;
        this.isSubmitted = false;
    }
}

