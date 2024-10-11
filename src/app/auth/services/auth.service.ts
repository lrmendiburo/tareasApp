import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';

import { Rol, User } from '../../core/interfaces/interfaces';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _user!: User;
  private _token!: string;
  users = signal<User[]>([]);
  isAuth: boolean = true;
  userEmpty = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '' as Rol,
  };

  constructor(private http: HttpClient) { }

  public get user(): User {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('user') != null) {
      this._user = JSON.parse(sessionStorage.getItem('user')!);
      return this._user
    }
    return this.userEmpty;
  }

  public get token(): string | undefined {
    if (typeof sessionStorage !== 'undefined') {
      if (this._token !== undefined) {
        return this._token;
      } else if (this._token === undefined) {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken !== null) {
          this._token = storedToken;
          return this.token;
        } else {
          return undefined;
        }
      }
    }
    return undefined;
  }

  // Login json-server-auth
  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }

  guardarUser(user: User): void {
    this._user =
    {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    };
    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken)
  }

  obtenerDatosToken(accessToken: string | undefined): any {
    if (accessToken) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.email && payload.email.length > 0) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = '';
    this._user = this.userEmpty;
    sessionStorage.clear();
  }

  hasRole(role: string): boolean {
    if (this.user.role.includes(role)) {
      return true;
    }
    return false;
  }

}  
