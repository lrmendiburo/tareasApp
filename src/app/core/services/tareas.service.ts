import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, tap } from 'rxjs';
import { Tarea } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private baseUrl: string = environment.baseUrl;

  tareas = signal<Tarea[]>([]);

  constructor(private http: HttpClient) { }

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.baseUrl}/tareas`)
      .pipe(tap((res) => this.tareas.set(res)));
  }

  getTareasByUser(userId: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.baseUrl}/tareas?usuario_responsable=${userId}`)
      .pipe(tap((res) => this.tareas.set(res)));
  }

  getTareaById(tareaId: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.baseUrl}/tareas/${tareaId}`);
  }

  createTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(`${this.baseUrl}/tareas`, tarea)
      .pipe(tap(this._actualizarLista));
  }

  updateTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.baseUrl}/tareas/${tarea.id}`, tarea)
      .pipe(tap(this._actualizarLista));
  }

  deleteTarea(tareaId: string): Observable<Tarea> {
    return this.http.delete<Tarea>(`${this.baseUrl}/tareas/${tareaId}`)
      .pipe(
        tap((_) => {
          this.tareas.set(this.tareas().filter((tar) => tar.id !== tareaId))
        })
      );
  }

  private _actualizarLista = (tarea: Tarea) => {
    const index = this.tareas().findIndex((tareaSignal) => tareaSignal.id === tarea.id);
    if (index === -1) {
      this.tareas.set([...this.tareas(), tarea]);
    } else {
      const updatedTareas = this.tareas().slice();
      updatedTareas[index] = tarea;
      this.tareas.set(updatedTareas);
    }
  }

}  
