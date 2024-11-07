import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-operation-requests',
  standalone: true,
  imports: [],
  templateUrl: './list-operation-requests.component.html',
  styleUrl: './list-operation-requests.component.scss'
})
export class ListOperationRequestsComponent implements OnInit {

  visible: boolean = false;


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  showDialog() {
    this.visible = true;
  }

}
