import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CreateAllergiesDto } from '../../../../domain/allergy-model';
import { AllergyService } from '../../../../services/allergy.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-allergies',
  standalone: true,
  imports: [DialogModule,CommonModule,ToastModule,ButtonModule,InputTextModule,FormsModule],
  templateUrl: './create-allergies.component.html',
  styleUrl: './create-allergies.component.scss'
})
export class CreateAllergiesComponent {

  constructor(
    private allergyService: AllergyService,
    private messageService: MessageService
) {}

  allergyName: string = '';
  allergyCode: string = '';
  allergyDescription: string = '';
  
  visible: boolean = false;
  
  showDialog() {
    this.visible = true;
  }

  createAllergy() {
    const createAllergyDto = new CreateAllergiesDto(
      this.allergyName,
      this.allergyCode,
      this.allergyDescription
    );

    const payload = JSON.stringify(createAllergyDto);
    console.log(payload);

    this.allergyService.saveAllergy(createAllergyDto).subscribe(
      () => {
          this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Allergy saved successfully!'
          });
          this.resetForm();
          this.visible = false;
          setTimeout(() => {
              window.location.reload();
          }, 500); 
      },
      (error) => {
          console.error('Erro saving allergy:', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Not possible to save allergy.'
          });
      }
  );
  }

  resetForm() {
    this.allergyName = '';
  }
}


