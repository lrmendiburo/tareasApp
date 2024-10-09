import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  templateUrl: './toast-msg.component.html',
  styleUrl: './toast-msg.component.css',
})
export class ToastMsgComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}  