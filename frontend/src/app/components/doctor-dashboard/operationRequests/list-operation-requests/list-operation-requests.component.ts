import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'list-operation-requests',
  standalone: true,
  imports: [TableModule,DialogModule,DataViewModule],
  templateUrl: './list-operation-requests.component.html',
  styleUrl: './list-operation-requests.component.scss'
})
export class ListOperationRequestsComponent implements OnInit {
  operationRequests: any[] = []; 

  constructor(private operationRequestService: OperationRequestService) {}

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
}
