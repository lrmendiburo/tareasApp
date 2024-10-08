import { Component } from '@angular/core';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,

    // Material
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router,
    private authService: AuthService) { }


  salir() {
    // TODO: Limpiar datos del auth
    this.router.navigate(['./login']);
    this.authService.salir();
  }

}
