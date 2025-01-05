import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { MedicalRecordService } from '../../../services/medical-record-service';
import { PatientService } from '../../../services/patient.service';
import { jsPDF } from 'jspdf';
import { Appointment } from '../../../domain/appointment-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-medical-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-medical-record.component.html',
  styleUrls: ['./download-medical-record.component.scss']
})
export class DownloadMedicalRecordComponent implements OnInit {
  patientId: string = '';
  medicalRecord: any = null;
  appointments: Appointment[] = [];
  patientData: any = null;

  allergies: any[] = [];
  filteredAllergies: any[] = [];
  medicalConditions: any[] = [];
  filteredMedicalConditions: any[] = [];

  constructor(
    private medicalRecordService: MedicalRecordService,
    private appointmentsService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.getPatient();
  }

  getPatient() {
    const email = localStorage.getItem('email');
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe(
        (patientData) => {
          console.log('Paciente encontrado:', patientData);
          this.patientId = patientData.medicalRecordNumber;
          this.patientData = patientData;
          this.fetchAppointments();
          this.fetchMedicalRecord();
        },
        (error) => {
          console.error('Erro ao obter dados do paciente:', error);
        }
      );
    } else {
      console.error('Email não encontrado no localStorage');
    }
  }

  fetchMedicalRecord() {
    this.medicalRecordService.getMedicalRecordByPatientMedicalRecordNumber(this.patientId).subscribe(
      (data) => {
        this.medicalRecord = data;
        console.log('Medical Record:', data);
        this.loadMedicalConditions(data.medicalConditionsId || []);
        this.loadAllergies(data.allergiesId || []);
      },
      (error) => {
        console.error('Erro ao buscar o histórico médico:', error);
      }
    );
  }

  fetchAppointments() {
    this.appointmentsService.getAppointmentsByPatient(this.patientId).subscribe(
      (data) => {
        this.appointments = data;
        console.log('Appointments:', data);
      },
      (error) => {
        console.error('Erro ao buscar os agendamentos:', error);
      }
    );
  }

  loadMedicalConditions(medicalConditionsIds: string[]) {
    if (!medicalConditionsIds || medicalConditionsIds.length === 0) {
      console.warn('No medical conditions IDs provided.');
      this.medicalConditions = [];
      this.filteredMedicalConditions = [];
      return;
    }

    this.medicalConditions = [];

    const medicalContionRequests = medicalConditionsIds.map((id) =>
      this.medicalRecordService.getMedicalConditionById(id).toPromise().catch((error) => {
        console.error(`Error loading medical condition with ID ${id}:`, error);
        return null;
      })
    );

    Promise.all(medicalContionRequests).then((medicalConditions) => {
      this.medicalConditions = medicalConditions.filter((medicalCondition) => medicalCondition !== null);
      this.filteredMedicalConditions = [...this.medicalConditions];
    });
  }

  loadAllergies(allergyIds: string[]) {
    if (!allergyIds || allergyIds.length === 0) {
      console.warn('No allergy IDs provided.');
      this.allergies = [];
      this.filteredAllergies = [];
      return;
    }

    this.allergies = [];

    const allergyRequests = allergyIds.map((id) =>
      this.medicalRecordService.getAllergyById(id).toPromise().catch((error) => {
        console.error(`Error loading allergy with ID ${id}:`, error);
        return null;
      })
    );

    Promise.all(allergyRequests).then((allergies) => {
      this.allergies = allergies.filter((allergy) => allergy !== null);
      this.filteredAllergies = [...this.allergies];
    });
  }

  generatePDF() {
    console.log("Gerando PDF...");
    const doc = new jsPDF();
    let yPosition = 10;
  
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const title = 'Medical Record and Appointments';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, yPosition);
    yPosition += 20;
  
    if (this.patientData) {
      doc.setFontSize(12);

      // Definindo a posição inicial
      const initialX = 15;
      const initialY = yPosition;
      const boxMargin = 5;  // Distância das bordas da caixa
      const boxWidth = 180;  // Largura da caixa
      const boxHeight = 8;  // Altura de cada linha
  
      // Coletando todos os detalhes pessoais em um array
      const patientDetails = [
        { label: "Name:", value: `${this.patientData.firstName} ${this.patientData.lastName}` },
        { label: "MRN:", value: this.patientData.medicalRecordNumber },
        { label: "Birth:", value: this.patientData.birthDate || 'N/A' },
        { label: "Gender:", value: this.patientData.gender || 'N/A' },
        { label: "Address:", value: this.patientData.address ||'N/A' },
        { label: "Phone:", value: this.patientData.phoneNumber || 'N/A' },
        { label: "Email:", value: this.patientData.email || 'N/A' },
      ];
  
      // Escrevendo o conteúdo dentro da caixa
      let currentY = initialY + boxMargin;
      const column1X = initialX;
      const column2X = initialX + boxWidth + boxMargin * 2;
  
      patientDetails.forEach((detail, index) => {
        // Coloca os campos lado a lado (2 por linha)
        if (index % 2 === 0) {
          doc.setFont("helvetica", "bold");
          doc.text(detail.label, column1X, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(detail.value, column1X + 20, currentY);
        } else {
          // Colocando o rótulo em negrito
          doc.setFont("helvetica", "bold");
          doc.text(detail.label, 150, currentY);
          // Colocando o valor em normal
          doc.setFont("helvetica", "normal");
          doc.text(detail.value, 170, currentY);
          currentY += boxHeight;  // Avança para a próxima linha quando a segunda coluna é preenchida
        }
      });
  
      yPosition = currentY + 12;  // Ajusta a posição para a próxima parte do documento
    }

    var yPositionMed = yPosition; // Inicializa a posição para as condições médicas

// Adiciona as alergias
if (this.allergies.length > 0) {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('Allergies:', 15, yPosition + 10);
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  this.allergies.forEach((allergy, index) => {
    doc.text(`${index + 1}: ${allergy.name}`, 15, yPosition + 10);
    yPosition += 8;
  });
}

// Define a posição inicial da segunda coluna para as condições médicas
const conditionColumnX = 120; // Ajuste conforme necessário

// Adiciona as condições médicas ao lado das alergias
if (this.medicalConditions.length > 0) {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('Medical Conditions:', conditionColumnX, yPositionMed + 10);
  yPositionMed += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  this.medicalConditions.forEach((condition, index) => {
    doc.text(`${index + 1}: ${condition.name}`, conditionColumnX, yPositionMed + 10);
    yPositionMed += 8;
  });
}
if (this.appointments && this.appointments.length > 0) {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('Appointments:', 15, yPosition + 15);
  yPosition += 20; // Ajusta a posição para o título das "Appointments"

  this.appointments.forEach((appointment, index) => {
      const boxStartY = yPosition + 5; // Marca o início do retângulo
      const boxHeight = 30; // Altura fixa para cada retângulo (ajuste conforme necessário)
      
      // Desenha o retângulo ao redor do conteúdo do appointment
      doc.setDrawColor(0); // Define a cor da borda (preto)
      doc.setLineWidth(0.5); // Define a espessura da borda
      doc.rect(15, boxStartY, 190, boxHeight); // (x, y, largura, altura)

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Adiciona as informações dentro do retângulo
      yPosition += 12; // Espaço inicial dentro do retângulo
      doc.text(`${index + 1}. ${appointment.operationRequestDto.operationType.name}`, 15, yPosition);

      yPosition += 8;
      doc.text(`Date: ${appointment.dateAndTime}`, 15, yPosition);

      yPosition += 8;
      doc.text(`Duration: ${appointment.operationRequestDto.operationType.estimatedDuration} minutes`, 15, yPosition);

      yPosition += 20; // Espaço adicional entre os appointments
  });
}

// Nome dinâmico do arquivo com patientMedicalRecordNumber
const fileName = `medical-record-${this.patientId || 'unknown'}.pdf`;

// Salva o PDF com o nome personalizado
doc.save(fileName);
  }
}