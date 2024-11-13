import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StaffService } from '../../../../services/staff.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'list-staffs',
    templateUrl: './list-staffs.component.html',
    styleUrls: ['./list-staffs.component.scss'],
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        PanelModule,
        AvatarModule,
        ToastModule,
        CommonModule,
        FormsModule
    ],
    providers: [StaffService, MessageService]
})
export class ListStaffsComponent implements OnInit {
    staffs: any[] = [];
    errorMessage: string | null = null;
    
    searchParams = {
        name: '',
        specialization: '',
        status: -1
    };

    items: { label?: string; icon?: string; separator?: boolean }[] = [];

    constructor(
        private router: Router,
        private staffService: StaffService,
        private messageService: MessageService
    ) {}

    loadStaffs() {
        this.staffService.getStaffs().subscribe(
            (staffs) => {
                console.log('Lista de staffs:', staffs); // Verifique a saída no console
                this.staffs = staffs;
            },
            (error) => {
                console.error('Erro ao carregar staff:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar a lista de staff.'
                });
                this.errorMessage = 'Não foi possível carregar a lista de staff.';
            }
        );
    }

    ngOnInit(): void {
        this.loadStaffs(); // Carrega a lista inicial
        this.items = [
            { label: 'Refresh', icon: 'pi pi-refresh' },
            { label: 'Search', icon: 'pi pi-search' },
            { separator: true },
            { label: 'Delete', icon: 'pi pi-times' }
        ];
    }

    // Método de busca para filtrar a lista de staff
   /* onSearch(): void {
        this.staffService.getFilteredStaffs(this.searchParams).subscribe(
            (response) => {
                this.staffs = response;
                this.errorMessage = null;
            },
            (error) => {
                this.errorMessage = 'Nenhum staff encontrado com os critérios fornecidos.';
                this.staffs = [];
            }
        );
    } */
}
