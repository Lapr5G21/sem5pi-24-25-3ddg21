import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'edit-operation-requests',
  standalone: true, // Definido no decorator do componente
  imports: [CommonModule, ReactiveFormsModule,DialogModule],
  templateUrl: './edit-operation-requests.component.html',
  styleUrls: ['./edit-operation-requests.component.scss'],
})
export class EditOperationRequestsComponent implements OnInit {
  operationRequestId: string | null = null;
  operationRequestForm: FormGroup;
  display: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private operationRequestService: OperationRequestService,
    private router: Router
  ) {
    this.operationRequestForm = this.fb.group({
      priority: ['', Validators.required],
      status: ['', Validators.required],
      deadlineDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Pega o ID da rota
    this.operationRequestId = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', this.operationRequestId);

    // Buscar os dados do OperationRequest com o ID
    if (this.operationRequestId) {
      this.operationRequestService.getOperationRequests().subscribe((requests: any[]) => {
        console.log('Todas as solicitações:', requests); // Log de todas as solicitações
        const request = requests.find(r => r.operationRequestId === this.operationRequestId);
        console.log('Solicitação encontrada:', request); // Verifica se a solicitação é encontrada
        if (request) {
          this.operationRequestForm.patchValue({
            priority: request.priority,
            status: request.status,
            deadlineDate: request.deadlineDate,
          });
        }
      });
    }
  }

  openDialog(): void {
    this.display = true; // Exibe o diálogo
  }

  closeDialog(): void {
    this.display = false; // Fecha o diálogo
  }

  onSubmit(): void {
    if (this.operationRequestForm.valid) {
      const updatedRequest = {
        operationRequestId: this.operationRequestId,
        ...this.operationRequestForm.value,
      };
      // Chama o serviço para atualizar o request
      this.operationRequestService.updateOperationRequest(updatedRequest).subscribe(() => {
        this.router.navigate(['/operation-requests']);
      });
    }
  }
}