import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [SidebarModule, ButtonModule]
})
export class SidebarComponent {
    sidebarVisible: boolean = false;
}