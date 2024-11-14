import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'list-operation-requests',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [TableModule,DialogModule,DataViewModule,ButtonModule,CommonModule],
  templateUrl: './list-operation-requests.component.html',
  styleUrl: './list-operation-requests.component.scss'
})
export class ListOperationRequestsComponent implements OnInit {
  operationRequests: any[] = []; 

  constructor(private operationRequestService: OperationRequestService,private confirmationService: ConfirmationService,
    private messageService: MessageService) {}

  visible: boolean = false;

  loadOperationRequests() {
    this.operationRequestService.getOperationRequests().subscribe(
      (operationRequests) => {
        console.log('operationRequests:', operationRequests);
        this.operationRequests = operationRequests; 
      },
      (error) => console.error('Erro ao carregar Tipos de Operações', error)
    );
  }

  ngOnInit(): void {
    this.loadOperationRequests(); 
  }

  showDialog() {
    this.visible = true;
  }

  removeOperationRequest(id: string) {
    this.operationRequestService.removeOperationRequest(id).subscribe(
      () => {
        // Atualiza o status para refletir a desativação sem remover o item da lista
        const request = this.operationRequests.find(item => item.id === id);
        if (request) {
          request.status = 'DESATIVADO';
        }
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Operação desativada com sucesso!'});
      },
      (error) => {
        console.error('Erro ao desativar operação', error);
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao desativar a operação!'});
      }
    );
  }

  confirmDeactivateOperationRequest(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja desativar esta operação?',
      accept: () => {
        this.removeOperationRequest(id);
      }
    });
  }
}
