import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { User } from '../interfaces/interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string = environment.baseUrl;

  users = signal<User[]>([]);

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
      .pipe(tap((res) => {
        this.users.set(res)
      }));
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  // Register json-server-auth
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user)
      .pipe(tap(this._actualizarLista));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user)
      .pipe(tap(this._actualizarLista));
  }

  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${userId}`)
      .pipe(
        tap((_) => {
          this.users.set(this.users().filter((usuar) => usuar.id !== userId))
        })
      );
  }

  private _actualizarLista = (user: User) => {
    const index = this.users().findIndex((userSignal) => userSignal.id === user.id);
    if (index === -1) {
      this.users.set([...this.users(), user]);
    } else {
      const updatedUsers = this.users().slice();
      updatedUsers[index] = user;
      this.users.set(updatedUsers);
    }
  }

}  
