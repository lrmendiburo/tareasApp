import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastMsgComponent } from '../components/toast-msg/toast-msg.component';

@Injectable({
  providedIn: 'root',
})
export class ToastMsgService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: '',
  };

  private messages = {
    createOk: 'Elemento creado con éxito.',
    updateOk: 'Elemento modificado con éxito.',
    deleteOk: 'Elemento eliminado con éxito.',
    loginOK: 'Sesión abierta con éxito.',
    deleteNotOk: 'Borre primero las relaciones de este elemento.',
    loginNotOk: 'Usuario o contraseña incorrecta.',
  } as const;

  constructor(private snackBar: MatSnackBar) { }

  private showToast(key: keyof typeof this.messages, state: 'success' | 'error'): void {
    const message = this.messages[key];
    const panelClass = this.getPanelClass(state);

    const config = { ...this.defaultConfig, panelClass: panelClass };

    this.snackBar.openFromComponent(ToastMsgComponent, {
      ...config,
      data: { message, title: state === 'success' ? 'Operación éxitosa' : 'Operación erronea' },
    });
  }

  private getPanelClass(state: 'success' | 'error'): string {
    return state === 'success' ? 'toast-success' : 'toast-error';
  }

  public success(key: keyof typeof this.messages): void {
    this.showToast(key, 'success');
  }

  public error(key: keyof typeof this.messages): void {
    this.showToast(key, 'error');
  }
}  