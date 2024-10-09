import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean = true;

  constructor() { }

  entrar() {
    this.isAuth = true;
  }

  salir() {
    this.isAuth = false;
  }
}
