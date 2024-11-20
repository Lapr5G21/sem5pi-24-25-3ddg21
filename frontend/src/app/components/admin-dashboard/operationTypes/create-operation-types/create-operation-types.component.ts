import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../../services/operation-type-service.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateOperationTypeDto } from '../../../../domain/operationType-model';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'create-operation-types-modal',
    templateUrl: './create-operation-types.component.html',
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
        FormsModule,
        CommonModule,
        HttpClientModule,
        ToastModule
    ],
    providers: [OperationTypeService, MessageService]
})
export class CreateOperationTypesComponent implements OnInit {
    visible: boolean = false;
    optionList: SelectItem[] = [];
    selectedSpecializations: string[] = [];
    staffNumbers: { [key: string]: number } = {};

    operationTypeName: string = '';
    estimatedDuration: number | null = null;
    anesthesiaTime: number | null = null;
    surgeryTime: number | null = null;
    cleaningTime: number | null = null;

    constructor(
        private operationTypeService: OperationTypeService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadSpecializations();
    }

    loadSpecializations() {
        this.operationTypeService.getSpecializations().subscribe(
            (specializations) => {
                this.optionList = specializations.map(spec => ({
                    label: spec.specializationName,
                    value: spec.id
                }));
            },
            (error) => {
                console.error('Erro ao carregar especializações:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar as especializações.'
                });
            }
        );
    }
    
    showDialog() {
        this.visible = true;
    }

    saveOperationType() {
        console.log('Selected Specializations:', this.selectedSpecializations);
        console.log('Staff Numbers:', this.staffNumbers);

        const specializationsData = this.selectedSpecializations.map(specId => {
            return {
                specializationId: specId,
                numberOfStaff: this.staffNumbers[specId] || 0
            };
        });

        const operationType = new CreateOperationTypeDto(
            this.operationTypeName,
            this.estimatedDuration ?? 0,
            this.anesthesiaTime ?? 0,
            this.surgeryTime ?? 0,
            this.cleaningTime ?? 0,
            specializationsData
        );

        console.log('Payload:', JSON.stringify(operationType));

        this.operationTypeService.saveOperationType(operationType).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Tipo de operação salvo com sucesso!'
                });
                this.resetForm();
                this.visible = false;
            },
            (error) => {
                console.error('Erro ao salvar tipo de operação:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o tipo de operação.'
                });
            }
        );
    }

    resetForm() {
        this.operationTypeName = '';
        this.estimatedDuration = null;
        this.anesthesiaTime = null;
        this.surgeryTime = null;
        this.cleaningTime = null;
        this.selectedSpecializations = [];
        this.staffNumbers = {};
    }

    isFormValid(): boolean {
        return this.operationTypeName != null && 
               this.estimatedDuration != null && 
               this.anesthesiaTime != null && 
               this.surgeryTime != null && 
               this.cleaningTime != null && 
               this.selectedSpecializations.length > 0;
    }    
    
}
