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
    imports: [DialogModule, ButtonModule, InputTextModule, MultiSelectModule, TableModule,FormsModule,DropdownModule,CommonModule,HttpClientModule],
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
        this.operationTypeService.getSpecializations().subscribe(
            (specializations) => {
                this.optionList = specializations.map(spec => ({
                    label: spec.name, 
                    value: spec.name
                }));
            },
            (error) => console.error('Erro ao carregar especializações:', error)
        );
    }

    showDialog() {
        this.visible = true;
    }

    saveOperationType() {
        const operationTypeData = {
            name: this.operationTypeName,
            estimatedDuration: this.estimatedDuration,
            anesthesiaTime: this.anesthesiaTime,
            surgeryTime: this.surgeryTime,
            cleaningTime: this.cleaningTime,
            specializations: this.selectedSpecializations.map(spec => ({
                specializationId: spec,
                numberOfStaff: this.staffNumbers[spec] || 0
            }))
        };

        this.operationTypeService.saveOperationType(operationTypeData).subscribe(
            () => {
                console.log('Tipo de operação salvo com sucesso!');
                this.visible = false;
            },
            (error) => console.error('Erro ao salvar tipo de operação:', error)
        );
    }
}