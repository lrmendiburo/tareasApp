import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Estado, Tarea } from '../../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../services/usuarios.service';
import { TareasService } from '../../../services/tareas.service';
import { ToastMsgService } from '../../../../shared/services/toast-msg.service';

@Component({
  selector: 'app-form-tareas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './form-tareas.component.html',
  styleUrl: './form-tareas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTareasComponent {

  title: string = "Crear Tarea"
  estadoActual: string = '';
  esEditar: boolean = false;
  estados = Object.values(Estado);
  private subscriptions: Subscription = new Subscription();

  myForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuario_responsable: ['', Validators.required],
  })

  constructor(private formBuilder: FormBuilder,
    private tareaService: TareasService,
    private usuarioService: UsuariosService,
    private toastService: ToastMsgService,
    @Inject(MAT_DIALOG_DATA) public tareaSelectedId: string | null) { }

  get usuarios() {
    return this.usuarioService.usuarios;
  }

  ngOnInit(): void {
    if (this.tareaSelectedId) {
      this.title = "Editar Tarea";
      this.esEditar = true;
      const subscription = this.tareaService.getTareaById(this.tareaSelectedId).subscribe((tarea) => {
        this.myForm.patchValue(tarea);
        this.estadoActual = tarea.estado;
      });
      this.subscriptions.add(subscription);
    }
  }

  enviar() {
    const tarea = this.myForm.value as Tarea;
    if (this.esEditar) {
      tarea.id = this.tareaSelectedId!;
      if (this.estadoActual) {
        tarea.estado = this.estadoActual as Estado;
      }
      const subscription = this.tareaService.updateTarea(tarea).subscribe();
      this.toastService.success('updateOk');  
      this.subscriptions.add(subscription);
    } else {
      tarea.estado = 'PENDIENTE' as Estado;
      const subscription = this.tareaService.createTarea(tarea).subscribe();
      this.toastService.success('createOk');
      this.subscriptions.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
