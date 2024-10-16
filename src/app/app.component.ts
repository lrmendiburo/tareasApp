import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './auth/components/login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';

import { AuthService } from './auth/services/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tareasApp';

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  constructor(private authService: AuthService) { }
}
