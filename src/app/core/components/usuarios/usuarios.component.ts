import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RolPipe } from '../../../shared/pipes/rol.pipe';
import { UsuariosService } from '../../services/usuarios.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormUsuariosComponent } from './form-usuarios/form-usuarios.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Usuario } from '../../interfaces/interfaces';
import { TareasService } from '../../services/tareas.service';
import { ToastMsgService } from '../../../shared/services/toast-msg.service';

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
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'nombre', 'user', 'role', 'delete'];
  private subscriptions: Subscription = new Subscription();

  constructor(private dialog: MatDialog,
    private usuarioService: UsuariosService,
    private tareasService: TareasService,
    private toastService: ToastMsgService) { }

  get usuarios() {
    return this.usuarioService.usuarios;
  }

  get tareas() {
    return this.tareasService.tareas;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    const subscriptionU = this.usuarioService.getUsuarios().subscribe();
    this.subscriptions.add(subscriptionU);
    const subscriptionT = this.tareasService.getTareas().subscribe();
    this.subscriptions.add(subscriptionT);
  }

  eliminar(usuarioId: string) {
    if (this.isUsuarioAsignado(usuarioId)) {
      this.toastService.error('deleteNotOk');
      return;
    }
    const subscription = this.usuarioService.deleteUsuario(usuarioId).subscribe();
    this.toastService.success('deleteOk');
    this.subscriptions.add(subscription);
  }

  private isUsuarioAsignado(usuarioId: string): boolean {
    return this.tareas().some(tarea => tarea.usuario_responsable === usuarioId);
  }

  openDialog(usuarioSelectedId: string | null) {
    const dialogRef = this.dialog.open(FormUsuariosComponent, { data: usuarioSelectedId });
    const subscription = dialogRef.afterClosed().subscribe();
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
