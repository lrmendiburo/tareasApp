import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastMsgService } from '../../shared/services/toast-msg.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private toastService: ToastMsgService) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.toastService.error('accessNotOk');
      this.router.navigate(['/login']);
      return false;
    }
  };

}