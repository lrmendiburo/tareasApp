import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RolPipe } from '../../../shared/pipes/rol.pipe';
import { UsuariosService } from '../../services/usuarios.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormUsuariosComponent } from './form-usuarios/form-usuarios.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { TareasService } from '../../services/tareas.service';
import { ToastMsgService } from '../../../shared/services/toast-msg.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RolPipe,

    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'delete'];
  private subscriptions: Subscription = new Subscription();
  usuariosFiltrados = new MatTableDataSource<User>();
  criterio: string = '';


  constructor(private dialog: MatDialog,
    private usuarioService: UsuariosService,
    private tareasService: TareasService,
    private toastService: ToastMsgService) { }

  get usuarios() {
    return this.usuarioService.users;
  }

  get tareas() {
    return this.tareasService.tareas;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    const subscriptionU = this.usuarioService.getUsers()
      .subscribe(usuarios => this.usuariosFiltrados.data = usuarios);
    this.subscriptions.add(subscriptionU);
    const subscriptionT = this.tareasService.getTareas().subscribe();
    this.subscriptions.add(subscriptionT);
  }

  eliminar(usuarioId: string) {
    if (this.isUsuarioAsignado(usuarioId)) {
      this.toastService.error('deleteNotOk');
      return;
    }
    const subscription = this.usuarioService.deleteUser(usuarioId)
      .subscribe(() => this.applyFilter());
    this.toastService.success('deleteOk');
    this.subscriptions.add(subscription);
  }

  private isUsuarioAsignado(usuarioId: string): boolean {
    return this.tareas().some(tarea => tarea.usuario_responsable === usuarioId);
  }

  openDialog(usuarioSelectedId: string | null) {
    const dialogRef = this.dialog.open(FormUsuariosComponent, { data: usuarioSelectedId });
    const subscription = dialogRef.afterClosed()
      .subscribe(() => {
        this.applyFilter();
      });
    this.subscriptions.add(subscription);
  }

  checkFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const lowerFilterValue = filterValue.toLowerCase();
    this.criterio = lowerFilterValue;
    this.applyFilter();
  }

  applyFilter() {
    this.usuarioService.getUsers()
      .subscribe(
        () => {
          const filteredList = this.usuarios().filter(usuario =>
            usuario.name.toLowerCase().includes(this.criterio) ||
            usuario.role.toLowerCase().includes(this.criterio)
          );
          this.usuariosFiltrados.data = filteredList;

        }
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
