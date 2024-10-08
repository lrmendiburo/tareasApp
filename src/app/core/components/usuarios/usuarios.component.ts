import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RolPipe } from '../../../shared/pipes/rol.pipe';
import { Usuario } from '../../interfaces/interfaces';
import { UsuariosService } from '../../services/usuarios.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormUsuariosComponent } from './form-usuarios/form-usuarios.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RolPipe,

    // Material
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  displayedColumns: string[] = ['id', 'nombre', 'user', 'role', 'delete'];

  constructor(private dialog: MatDialog,
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
  }

  eliminar(usuario: Usuario) {
    console.log('eliminar', usuario);

  }

  openDialog(usuarioSelected: Usuario | null) {
    const dialogRef = this.dialog.open(FormUsuariosComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
