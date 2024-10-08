import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Tarea } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private baseUrl: string = environment.baseUrl;
  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  tareas$: Observable<Tarea[]> = this.tareasSubject.asObservable();

  constructor(private http: HttpClient) { }

  initTareas(): void {
    this.fetchTareas();
  }

  private fetchTareas(): void {
    this.http.get<Tarea[]>(`${this.baseUrl}/tareas`)
      .subscribe(tareas => this.tareasSubject.next(tareas));
  }

  createTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(`${this.baseUrl}/tareas`, tarea)
      .pipe(
        tap(newTarea => {
          const currentTareaes = this.tareasSubject.value;
          this.tareasSubject.next([...currentTareaes, newTarea]);
        })
      );
  }

  updateTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.baseUrl}/tareas/${tarea.id}`, tarea)
      .pipe(
        tap(() => {
          const updatedTareaes = this.tareasSubject.value.map(h => h.id === tarea.id ? tarea : h);
          this.tareasSubject.next(updatedTareaes);
        })
      );
  }

  deleteTarea(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/tareas/${id}`)
      .pipe(
        tap(() => {
          const updatedTareaes = this.tareasSubject.value.filter(h => h.id !== id);
          this.tareasSubject.next(updatedTareaes);
        })
      );
  }

}  
