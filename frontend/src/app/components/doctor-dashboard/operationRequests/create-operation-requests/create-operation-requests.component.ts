import { Component, OnInit, SimpleChanges } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { OperationRequestService } from '../../../../services/operation-request.service';
import { CreateOperationRequestDTO, DoctorDTO, OperationTypeDTO, PatientDTO } from '../../../../domain/operationRequest-model';

@Component({
  selector: 'create-operation-requests',
  standalone: true,
  imports: [DialogModule, ToastModule, RadioButtonModule,FormsModule,DropdownModule,CalendarModule],
  templateUrl: './create-operation-requests.component.html',
  styleUrls: ['./create-operation-requests.component.scss'],
  providers: [OperationRequestService]
})

export class CreateOperationRequestsComponent implements OnInit {


  visible: boolean = false;
  priority: string = '';
  operationTypeName: string = '';
  operationType: SelectItem[] = [];
  deadlinedate: Date | null = null;
  status: string = '';
  doctor: SelectItem[] = [];
  doctorId: string = '';
  patient: SelectItem[] = [];
  selectedPatient: string | null = null;
  

  constructor(private operationRequestService: OperationRequestService) {}


  loadOperationTypes() {
    this.operationRequestService.getOperationTypes().subscribe(
      (operationTypes) => {
        console.log('operationTypes:', operationTypes);
        this.operationType = operationTypes.map(spec => ({
          label: spec.name,
          value: spec.id
        }));
      },
        (error) => console.error('Erro ao carregar Tipos de Operações', error)
    );

  }

  loadDoctors(){
    this.operationRequestService.getDoctors().subscribe(
      (doctors) => {
        console.log('Doctors:', doctors);
        this.doctor = doctors.map(doc => ({
          label: doc.staffFullName,
          value: doc.Id
        }));
      },
        (error) => console.error('Erro ao carregar Doutores', error)
    );
  }

  loadPacients() {
    this.operationRequestService.getPatients().subscribe(
      (patient) => {
        console.log('pacients:', patient);
        this.patient = patient.map(spec => ({
          label: spec.fullName,
          value: spec.email
        }));
      },
        (error) => console.error('Erro ao carregar Pacientes', error)
    );

  }

  ngOnInit()  {
    this.loadDoctors();
    this.loadOperationTypes();
    this.loadPacients();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.visible) {  
      this.resetForm();    
    }
  }
  
  showDialog() {
    this.visible = true;
  }

  closeDialog(){
    this.visible = false;
    this.resetForm();
  }

  

  saveOperationRequest() {
    const selectedOperationTypeId = this.operationTypeName || '';
    const selectedDeadline = this.deadlinedate ||  new Date();
    const selectedPatientId = this.selectedPatient || '';
    const selectedStaffId = this.doctorId || '';

    console.log('Selected Priority', this.priority);
    console.log('Operation Type Selected', this.operationTypeName);
    console.log('DeadLine selected', this.deadlinedate);
    console.log('Doctor selected', selectedStaffId);
    console.log('Patient selected', this.patient);

  

  const operationRequest = new CreateOperationRequestDTO(
        this.priority,
        new OperationTypeDTO(selectedOperationTypeId),
        selectedDeadline,
        this.status || 'onSchedule',
        new DoctorDTO(selectedStaffId),
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
    this.priority = ''; 
    this.operationTypeName = ''; 
    this.operationType = [];
    this.deadlinedate = null; 
    this.status = ''; 
    this.doctorId = ''; 
    this.selectedPatient = null ;
  }

}


