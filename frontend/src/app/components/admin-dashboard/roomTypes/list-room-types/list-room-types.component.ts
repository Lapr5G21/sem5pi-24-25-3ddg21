import { Component, OnInit } from '@angular/core';
import { RoomTypeService } from '../../../../services/room-type.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RoomType } from '../../../../domain/roomType-model';


@Component({
    selector: 'list-room-types',
    templateUrl: './list-room-types.component.html',
    styleUrls: ['./list-room-types.component.scss'],
    standalone: true,
    imports: [
        TableModule,
        DialogModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        ToastModule,
        ConfirmDialogModule,
        TagModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class ListRoomTypesComponent implements OnInit {
    roomTypes: any[] = []; // Lista de tipos de sala
    loading: boolean = false; // Indicador de carregamento

    constructor(
        private roomTypeService: RoomTypeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
      console.log('ngOnInit called');
        this.loadRoomTypes(); // Carregar os tipos de sala ao inicializar o componente
    }

    logData(data: any): void {
      console.log(data);
    }
    

    // Carrega os tipos de sala
    loadRoomTypes(): void {
      console.log('loadRoomTypes called');
        this.loading = true;
        this.roomTypeService.getRoomTypes().subscribe(
            (roomTypes) => {
                console.log('Room types received:', roomTypes);
                this.roomTypes = roomTypes;
                this.loading = false; // Certifique-se de que o loading é desativado
            },
            (error) => {
                console.error('Error loading room types:', error);
                this.loading = false; // Certifique-se de que o loading é desativado
            }
        );
    }

// Método para abrir o diálogo de confirmação
confirmDeleteRoomType(roomType: RoomType): void {
  console.log('Opening confirmation dialog for:', roomType); // Adicione este log
  this.confirmationService.confirm({
    message: `Are you sure you want to delete <br> <strong>${roomType.code}</strong>?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'p-button-danger center-label', // Botão Confirmar Vermelho
    rejectButtonStyleClass: 'p-button-secondary center-label', // Botão Cancelar
    accept: () => {
      this.deleteRoomType(roomType);
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Deletion cancelled.',
      });
    },
  });
}

// Método para deletar um tipo de sala
deleteRoomType(roomType: RoomType): void {
  this.roomTypeService.delete(roomType.code).subscribe(
    (response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${roomType.code} has been deleted.`,
      });
      this.loadRoomTypes(); // Recarrega a lista após a exclusão
    },
    (error) => {
      console.error('Error deleting room type:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete room type.',
      });
    }
  );
}

}
