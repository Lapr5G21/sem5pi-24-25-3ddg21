import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  standalone : true,
  imports : [MenubarModule],
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent {
  @Input() menuItems!: MenuItem[];

  ngOnChanges() {
    console.log('Menu Items:', this.menuItems);
  }
  
}