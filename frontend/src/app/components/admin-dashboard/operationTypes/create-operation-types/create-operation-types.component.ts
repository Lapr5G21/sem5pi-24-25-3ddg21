import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../../services/operation-type-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'create-operation-types-modal',
    templateUrl: './create-operation-types.component.html',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, MultiSelectModule, TableModule, FormsModule, DropdownModule, CommonModule, HttpClientModule],
    providers: [OperationTypeService]
})
export class CreateOperationTypesComponent implements OnInit {
    visible: boolean = false;
    optionList: SelectItem[] = [];
    selectedSpecializations: any[] = [];
    staffNumbers: { [key: string]: number } = {};

    operationTypeName: string = '';
    estimatedDuration: number | null = null;
    anesthesiaTime: number | null = null;
    surgeryTime: number | null = null;
    cleaningTime: number | null = null;

    constructor(private operationTypeService: OperationTypeService) {}

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
            (error) => console.error('Erro ao carregar especializações:', error)
        );
    }

    showDialog() {
        this.visible = true;
    }

    saveOperationType() {
        
        const operationType = {
            name: this.operationTypeName,
            estimatedTimeDuration: this.estimatedDuration,
            anesthesiaTime: this.anesthesiaTime,
            surgeryTime: this.surgeryTime,
            cleaningTime: this.cleaningTime,
            specializations: this.selectedSpecializations.map(spec => {
                return {
                    specializationId: spec, 
                    numberOfStaff: this.staffNumbers[spec.specializationId]
                };
            })
        };

        console.log('Payload:', JSON.stringify(operationType));

        this.operationTypeService.saveOperationType(operationType).subscribe(
            () => {
                console.log('Tipo de operação salvo com sucesso!');
                this.resetForm();
                this.visible = false;
            },
            (error) => console.error('Erro ao salvar tipo de operação:', error)
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
}
