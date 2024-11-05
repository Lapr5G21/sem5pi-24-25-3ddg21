import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    standalone: true,
    imports: [SidebarModule, ButtonModule]
})
export class SidebarComponent {
    sidebarVisible: boolean = false;

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
      }

    logout() {
        console.log('User logged out');
      }
}

