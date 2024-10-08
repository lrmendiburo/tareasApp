import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean = true;

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
