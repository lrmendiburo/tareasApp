import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Tarea, User } from '../../interfaces/interfaces';
import { Estado } from '../../interfaces/interfaces';

import { EstadoPipe } from '../../../shared/pipes/estado.pipe';

import { FormTareasComponent } from './form-tareas/form-tareas.component';

import { ToastMsgService } from '../../../shared/services/toast-msg.service';
import { AuthService } from '../../../auth/services/auth.service';
import { TareasService } from '../../services/tareas.service';
import { UsuariosService } from '../../services/usuarios.service';

// Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [
    EstadoPipe,
    CommonModule,
    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareasComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'responsable', 'delete'];
  private subscriptions: Subscription = new Subscription();
  estados = Object.values(Estado);
  estadoEnum = Estado;
  tareasFiltradas = new MatTableDataSource<Tarea>();
  criterio: string = '';
  currentUserId = signal(0);

  constructor(private dialog: MatDialog,
    private tareasService: TareasService,
    private usuarioService: UsuariosService,
    private authService: AuthService,
    private toastService: ToastMsgService) { }

  get tareas() {
    return this.tareasService.tareas;
  }

  get usuarios() {
    return this.usuarioService.users;
  }

  ngOnInit(): void {
    if (!this.authService.hasRole('ADMIN')) {
      this.currentUserId.set(JSON.parse(sessionStorage.getItem('user')!).id);
      this.cargarDatosUser();
    } else {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    const subscriptionU = this.usuarioService.getUsers().subscribe();
    this.subscriptions.add(subscriptionU);
    const subscriptionT = this.tareasService.getTareas()
      .subscribe(tareas => this.tareasFiltradas.data = tareas);
    this.subscriptions.add(subscriptionT);
  }

  cargarDatosUser() {
    const subscriptionU = this.usuarioService.getUsers().subscribe();
    this.subscriptions.add(subscriptionU);
    const subscriptionT = this.tareasService.getTareasByUser(this.currentUserId())
      .subscribe(tareas => {
        this.tareasFiltradas.data = tareas
      });
    this.subscriptions.add(subscriptionT);
  }

  encontrarUsuarioPorTarea(tarea: Tarea): User | undefined {
    return this.usuarios().find(usuario => usuario.id === tarea.usuario_responsable);
  }

  eliminar(tareaId: string) {
    const subscription = this.tareasService.deleteTarea(tareaId)
      .subscribe(() => this.applyFilter());
    this.toastService.success('deleteOk');
    this.subscriptions.add(subscription);
  }

  openDialog(tareaSelectedId: string | null) {
    const dialogRef = this.dialog.open(FormTareasComponent, {
      data: {
        tareaSelectedId,
        currentUserId: this.currentUserId()
      }
    });

    const subscription = dialogRef.afterClosed()
      .subscribe(() => this.applyFilter());
    this.subscriptions.add(subscription);
  }

  cambiarEstado(tareaId: string, nuevoEstado: Estado) {
    const tareaActual = this.tareas().find(tarea => tarea.id === tareaId);
    if (tareaActual && tareaActual.estado !== nuevoEstado) {
      tareaActual.estado = nuevoEstado;
      const subscription = this.tareasService.updateTarea(tareaActual)
        .subscribe(() => this.applyFilter());
      this.toastService.success('updateOk');
      this.subscriptions.add(subscription);
    }
  }

  checkFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const lowerFilterValue = filterValue.toLowerCase();
    this.criterio = lowerFilterValue;
    this.applyFilter();
  }

  applyFilter() {
    const filteredList = this.tareas().filter(tarea =>
      tarea.nombre.toLowerCase().includes(this.criterio) ||
      tarea.estado.toLowerCase().includes(this.criterio)
    );
    this.tareasFiltradas.data = filteredList;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
