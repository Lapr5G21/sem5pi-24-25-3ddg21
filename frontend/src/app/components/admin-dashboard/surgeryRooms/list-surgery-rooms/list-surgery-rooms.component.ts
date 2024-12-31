import { Component, OnInit } from '@angular/core';
import { SurgeryRoomService } from '../../../../services/surgery-room.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SurgeryRoom } from '../../../../domain/surgery-room-model';

@Component({
    selector: 'list-surgery-rooms',
    templateUrl: './list-surgery-rooms.component.html',
    styleUrls: ['./list-surgery-rooms.component.scss'],
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
export class ListSurgeryRoomsComponent implements OnInit {
    surgeryRooms: any[] = []; // Lista de salas de cirurgia
    loading: boolean = false; // Indicador de carregamento

    constructor(
        private surgeryRoomService: SurgeryRoomService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        console.log('ngOnInit called');
        this.loadSurgeryRooms(); // Carregar as salas de cirurgia ao inicializar o componente
    }

    logData(data: any): void {
        console.log(data);
    }

    // Carrega as salas de cirurgia
    loadSurgeryRooms(): void {
        console.log('loadSurgeryRooms called');
        this.loading = true;
        this.surgeryRoomService.getSurgeryRooms().subscribe(
            (surgeryRooms) => {
                console.log('Surgery rooms received:', surgeryRooms);
                this.surgeryRooms = surgeryRooms;
                this.loading = false; // Certifique-se de que o loading é desativado
            },
            (error) => {
                console.error('Error loading surgery rooms:', error);
                this.loading = false; // Certifique-se de que o loading é desativado
            }
        );
    }

    // Método para abrir o diálogo de confirmação
    confirmDeleteSurgeryRoom(surgeryRoom: SurgeryRoom): void {
        console.log('Opening confirmation dialog for:', surgeryRoom); // Adicione este log
        this.confirmationService.confirm({
            message: `Are you sure you want to delete <br> <strong>${surgeryRoom.id}</strong>?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger center-label', // Botão Confirmar Vermelho
            rejectButtonStyleClass: 'p-button-secondary center-label', // Botão Cancelar
            accept: () => {
                this.deleteSurgeryRoom(surgeryRoom);
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

    // Método para deletar uma sala de cirurgia
    deleteSurgeryRoom(surgeryRoom: SurgeryRoom): void {
        this.surgeryRoomService.delete(surgeryRoom.id).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: `${surgeryRoom.id} has been deleted.`,
                });
                this.loadSurgeryRooms(); // Recarrega a lista após a exclusão
            },
            (error) => {
                console.error('Error deleting surgery room:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete surgery room.',
                });
            }
        );
    }

    // Método para editar uma sala de cirurgia
    editSurgeryRoom(surgeryRoom: SurgeryRoom): void {
        console.log('Editing Surgery Room:', surgeryRoom);
        // Implemente a lógica de edição aqui
    }

 // Função para obter a severidade do status
getStatusSeverity(status: string): "success" | "warning" | "danger" | "info" | "secondary" | "contrast" | undefined {
  switch (status) {
      case 'AVAILABLE':
          return 'success';
      case 'OCCUPIED':
          return 'danger';
      case 'UNDER_MAINTENANCE':
          return 'warning';
      default:
          return 'info';  // Retorna 'info' como valor padrão
  }

    }
}
