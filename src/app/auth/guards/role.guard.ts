import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastMsgService } from '../../shared/services/toast-msg.service';



@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private toastService: ToastMsgService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data['role'] as string | string[];
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasAccess = rolesArray.some(role => this.authService.hasRole(role));
    if (hasAccess) {
      return true;
    } else {
      this.toastService.error('accessNotOk');
      this.router.navigate(['/tareas']);
      return false;
    }
  };

}