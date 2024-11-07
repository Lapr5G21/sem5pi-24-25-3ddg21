import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { CreateOperationRequestDTO, DoctorDTO, OperationTypeDTO, PatientDTO } from '../../../../domain/operationRequest-model';

@Component({
  selector: 'app-create-operation-requests',
  standalone: true,
  imports: [],
  templateUrl: './create-operation-requests.component.html',
  styleUrl: './create-operation-requests.component.scss',
  providers: [OperationRequestService]
})

export class CreateOperationRequestsComponent implements OnInit {


  visible: boolean = false;
  priority: string[] = [];
  operationType: SelectItem[] = [];
  deadlinedate: SelectItem[] = [];
  status: string = '';
  doctorId: string = '';
  PatientID: SelectItem[] = [];
  

  constructor(private operationRequestService: OperationRequestService) {}


  loadOperationTypes() {
    this.operationRequestService.getOperationTypes().subscribe(
      (operationTypes) => {
        this.operationType = operationTypes.map(spec => ({
          label: spec.operationTypeName,
          value: spec.id
        }));
      },
        (error) => console.error('Erro ao carregar Tipos de Operações', error)
    );

  }

  loadPacients() {
    this.operationRequestService.getPatients().subscribe(
      (pacients) => {
        this.PatientID = pacients.map(spec => ({
          label: spec.patientName,
          value: spec.id
        }));
      },
        (error) => console.error('Erro ao carregar Pacientes', error)
    );

  }

  ngOnInit()  {
    this.loadOperationTypes();
    this.loadPacients();
  }

  showDialog() {
    this.visible = true;
  }

  

  saveOperationRequest() {
    const selectedOperationType = this.operationType[0]?.value || '';
    const selectedDeadline = this.deadlinedate[0]?.value || '';
    const selectedPatientId = this.PatientID[0]?.value || '';

    console.log('Selected Priority', this.priority);
    console.log('Operation Type Selected', this.operationType);
    console.log('DeadLine selected', this.deadlinedate);
    console.log('Doctor selected', this.doctorId);
    console.log('Patient selected', this.PatientID);

  

  const operationRequest = new CreateOperationRequestDTO(
        this.priority,
        new OperationTypeDTO(selectedOperationType),
        selectedDeadline,
        this.status || 'onSchedule',
        new DoctorDTO(this.doctorId),
        new PatientDTO(selectedPatientId)
  );

  console.log('Payload:', JSON.stringify(operationRequest));

  this.operationRequestService.saveOperationRequest(operationRequest).subscribe(

    () => {
        console.log('Pedido de Operação registado com sucesso!');
        this.resetForm();
        this.visible = false;
    },

    (error) => console.error('Erro no registo de pedido de operação', error)

  );
  }


  resetForm() {
    this.priority = [];
    this.operationType = [];
    this.deadlinedate = [];
    this.status = '';
    this.doctorId = '';
    this.PatientID = [];
}

}


