import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'create-operation-types-modal',
    templateUrl: './create-operation-types.component.html',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, MultiSelectModule, TableModule,FormsModule,DropdownModule,CommonModule]
})
export class CreateOperationTypesComponent {
    visible: boolean = false;
    optionList: SelectItem[] = [
        { label: 'Cardiology', value: 'Cardiology' },
        { label: 'Orthopedist', value: 'Orthopedist' },
        { label: 'Neurology', value: 'Neurology' },
        { label: 'dsadsa', value: 'dsads' }
    ];
    selectedSpecializations: any[] = [];
    staffNumbers: { [key: string]: number } = {}; 

    showDialog() {
        this.visible = true;
    }

    saveOperationType() {
        console.log('Specializations selecionadas:', this.selectedSpecializations);
        console.log('Números de Staff:', this.staffNumbers);
        this.visible = false;
    }
}
