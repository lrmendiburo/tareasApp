import { Component } from '@angular/core';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastMsgService } from '../../services/toast-msg.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
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

  get esAdmin() {
    return this.authService.hasRole('ADMIN');
  }

  constructor(private router: Router,
    private authService: AuthService,
    private toastService: ToastMsgService) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
    this.toastService.success('logoutOK');
  }

}
