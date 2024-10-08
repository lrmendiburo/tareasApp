import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TareasService } from '../../services/tareas.service';
import { Tarea, Usuario } from '../../interfaces/interfaces';
import { tap } from 'rxjs';
import { EstadoPipe } from '../../../shared/pipes/estado.pipe';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [
    // Pipe
    EstadoPipe,

    // Material
    MatTableModule
  ],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit {

  tareas: Tarea[] = [];
  usuarios: Usuario[] = [];

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'responsable'];

  constructor(private tareasService: TareasService,
    private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.usuarioService.initUsuarios();
    this.usuarioService.usuarios$
      .subscribe(usuarios => {
        this.usuarios = usuarios;
      });

    this.tareasService.initTareas();
    this.tareasService.tareas$
      .subscribe(tareas => {
        this.tareas = tareas;
      });
  }

  prueba(tareaSelected: Tarea) {
    console.log(tareaSelected);
  }

  encontrarUsuarioPorTarea(tarea: Tarea): Usuario | undefined {
    return this.usuarios.find(usuario => usuario.id === tarea.usuario_responsable);
  }



}
