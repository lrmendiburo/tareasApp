import { Injectable } from '@angular/core';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean = false;

  constructor() { }

  entrar() {
    this.isAuth = true;
    console.log('entro', this.isAuth);
  }

  salir() {
    this.isAuth = false;
    console.log('salio', this.isAuth);
  }
}
