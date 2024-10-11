import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, Subscription } from 'rxjs';

import { Rol, User } from '../../../core/interfaces/interfaces';

import { AuthService } from '../../services/auth.service';
import { ToastMsgService } from '../../../shared/services/toast-msg.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Material
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  private subscriptions: Subscription = new Subscription();

  userToLogin: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '' as Rol,
  };

  myForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required],
  })

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastMsgService) { }

  login() {
    if (!(this.myForm.get('email')?.value) || !(this.myForm.get('pass')?.value)) {
      this.myForm.markAllAsTouched();
      this.toastService.error('loginEmpy');
    }

    this.userToLogin.email = this.myForm.get('email')?.value;
    this.userToLogin.password = this.myForm.get('pass')?.value;

    const subscription = this.authService.login(this.userToLogin).pipe(
      catchError(err => {
        if (err.status === 400) {
          this.toastService.error('loginNotOk');
        }
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.authService.guardarUser(response.user);
        this.authService.guardarToken(response.accessToken);
        this.router.navigate(['/tareas']);
        this.toastService.success('loginOK');
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
