import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TareasService } from '../../services/tareas.service';
import { Tarea, Usuario } from '../../interfaces/interfaces';
import { EstadoPipe } from '../../../shared/pipes/estado.pipe';
import { UsuariosService } from '../../services/usuarios.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { FormTareasComponent } from './form-tareas/form-tareas.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Estado } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { ToastMsgService } from '../../../shared/services/toast-msg.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [
    CommonModule,
    // Pipe
    EstadoPipe,

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

  constructor(private dialog: MatDialog,
    private tareasService: TareasService,
    private usuarioService: UsuariosService,
    private toastService: ToastMsgService) { }

  get tareas() {
    return this.tareasService.tareas;
  }

  get usuarios() {
    return this.usuarioService.usuarios;
  }

  ngOnInit(): void {
    debugger;
    this.cargarDatos();
  }

  cargarDatos() {
    const subscriptionU = this.usuarioService.getUsuarios().subscribe();
    this.subscriptions.add(subscriptionU);
    const subscriptionT = this.tareasService.getTareas()
      .subscribe(tareas => this.tareasFiltradas.data = tareas);
    this.subscriptions.add(subscriptionT);
  }

  encontrarUsuarioPorTarea(tarea: Tarea): Usuario | undefined {
    return this.usuarios().find(usuario => usuario.id === tarea.usuario_responsable);
  }

  eliminar(tareaId: string) {
    const subscription = this.tareasService.deleteTarea(tareaId)
      .subscribe(() => this.applyFilter());
    this.toastService.success('deleteOk');
    this.subscriptions.add(subscription);
  }

  openDialog(tareaSelectedId: string | null) {
    const dialogRef = this.dialog.open(FormTareasComponent, { data: tareaSelectedId });
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
