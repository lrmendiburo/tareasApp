import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Usuario } from '../interfaces/interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string = environment.baseUrl;

  usuarios = signal<Usuario[]>([]);

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`)
      .pipe(tap((res) => this.usuarios.set(res)));
  }

  getUsuarioById(usuarioId: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${usuarioId}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario)
      .pipe(tap(this._actualizarLista));
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios/${usuario.id}`, usuario)
      .pipe(tap(this._actualizarLista));
  }

  deleteUsuario(usuarioId: string): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.baseUrl}/usuarios/${usuarioId}`)
      .pipe(
        tap((_) => {
          this.usuarios.set(this.usuarios().filter((usuar) => usuar.id !== usuarioId))
        })
      );
  }
  
  private _actualizarLista = (usuario: Usuario) => {
    const index = this.usuarios().findIndex((usuarioSignal) => usuarioSignal.id === usuario.id);
    if (index === -1) {
      this.usuarios.set([...this.usuarios(), usuario]);
    } else {
      const updatedUsuarios = this.usuarios().slice();
      updatedUsuarios[index] = usuario;
      this.usuarios.set(updatedUsuarios);
    }
  }

  

}  
