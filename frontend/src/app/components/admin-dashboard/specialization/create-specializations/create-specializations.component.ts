import { Component } from '@angular/core';
import { CreatingSpecializationDto, Specialization } from '../../../../domain/operationType-model';
import { SpecializationsService } from '../../../../services/specializations-service.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-specializations',
  standalone: true,
  imports: [DialogModule,CommonModule,ToastModule,ButtonModule,InputTextModule,FormsModule],
  templateUrl: './create-specializations.component.html',
  styleUrl: './create-specializations.component.scss',
  providers : [SpecializationsService,MessageService]
})
export class CreateSpecializationsComponent {

  constructor(
    private specializationService: SpecializationsService,
    private messageService: MessageService
) {}

  specializationName: string = '';
  specializationCode: string = '';
  specializationDescription: string = '';
  visible: boolean = false;
  
  showDialog() {
    this.visible = true;
  }

  createSpecialization() {
    const createSpecializationDto = new CreatingSpecializationDto(
      this.specializationName,
      this.specializationCode,
      this.specializationDescription
    );

    const payload = JSON.stringify(createSpecializationDto);
    console.log(payload);

    this.specializationService.saveSpecialization(createSpecializationDto).subscribe(
      () => {
          this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Specialization saved successfully!'
          });
          this.resetForm();
          this.visible = false;
          setTimeout(() => {
              window.location.reload();
          }, 500); 
      },
      (error) => {
          console.error('Erro ao salvar tipo de operação:', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Not possible to save operation.'
          });
      }
  );
  }

  resetForm() {
    this.specializationName = '';
  }
}

