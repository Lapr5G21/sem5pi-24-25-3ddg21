import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
        
@Component({
    selector: 'create-operation-type-modal',
    templateUrl: './create-operation-types.html',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, AvatarModule]
})
export class CreateOperationTypesComponent {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}