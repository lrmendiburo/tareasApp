import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Usuario } from '../interfaces/interfaces';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string = environment.baseUrl;
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  constructor(private http: HttpClient) { }

  initUsuarios(): void {
    this.fetchUsuarios();
  }

  private fetchUsuarios(): void {
    this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`)
      .subscribe(usuarios => this.usuariosSubject.next(usuarios));
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario)
      .pipe(
        tap(newUsuario => {
          const currentUsuarioes = this.usuariosSubject.value;
          this.usuariosSubject.next([...currentUsuarioes, newUsuario]);
        })
      );
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios/${usuario.id}`, usuario)
      .pipe(
        tap(() => {
          const updatedUsuarioes = this.usuariosSubject.value.map(h => h.id === usuario.id ? usuario : h);
          this.usuariosSubject.next(updatedUsuarioes);
        })
      );
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/usuarios/${id}`)
      .pipe(
        tap(() => {
          const updatedUsuarioes = this.usuariosSubject.value.filter(h => h.id !== id);
          this.usuariosSubject.next(updatedUsuarioes);
        })
      );
  }

}  
