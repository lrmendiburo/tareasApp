import { Component } from '@angular/core';

// Material
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    // Material
    MatCardModule,
    MatButton,
    MatIconModule,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

  volver() {
    window.history.back()
  }

}
