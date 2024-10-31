import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tab-view-dynamic-demo',
    templateUrl: './table.component.html',
    standalone: true,
    imports: [TabViewModule, CommonModule]
})
export class TableComponent implements OnInit {
    tabs: { title: string, content: string }[] = [];

    ngOnInit() {
        this.tabs = [
            { title: 'Tab 1', content: 'Tab 1 Content' },
            { title: 'Tab 2', content: 'Tab 2 Content' },
            { title: 'Tab 3', content: 'Tab 3 Content' }
        ];
    }

}