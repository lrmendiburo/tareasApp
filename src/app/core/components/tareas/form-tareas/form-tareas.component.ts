import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Estado, Rol, Tarea, User } from '../../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../services/usuarios.service';
import { TareasService } from '../../../services/tareas.service';
import { ToastMsgService } from '../../../../shared/services/toast-msg.service';
import { AuthService } from '../../../../auth/services/auth.service';

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
  usuarioNoAdmin: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '' as Rol,
  };;

  myForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuario_responsable: ['', Validators.required],
  })

  get esAdmin() {
    return this.authService.hasRole('ADMIN');
  }

  constructor(private formBuilder: FormBuilder,
    private tareaService: TareasService,
    private usuarioService: UsuariosService,
    private toastService: ToastMsgService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { tareaSelectedId: string | null; currentUserId: string }
  ) { }

  get usuarios() {
    return this.usuarioService.users;
  }

  ngOnInit(): void {
    if (this.data.tareaSelectedId) {
      this.title = "Editar Tarea";
      this.esEditar = true;
      const subscription = this.tareaService.getTareaById(this.data.tareaSelectedId!).subscribe((tarea) => {
        this.myForm.patchValue(tarea);
        this.estadoActual = tarea.estado;
      });
      this.subscriptions.add(subscription);
    } else if (!this.esAdmin) {
      // Si no es admin, establece el usuario responsable con el currentUserId  
      this.myForm.patchValue({ usuario_responsable: this.data.currentUserId });
      this.myForm.controls['usuario_responsable'].disable(); // Deshabilita el campo
      this.usuarioService.getUserById(this.data.currentUserId).subscribe((user) =>
        this.usuarioNoAdmin = user
      );
    }


  }

  enviar() {
    const tarea = this.myForm.value as Tarea;
    if (this.esEditar) {
      tarea.id = this.data.tareaSelectedId!;
      if (this.estadoActual) {
        tarea.estado = this.estadoActual as Estado;
      }
      const subscription = this.tareaService.updateTarea(tarea).subscribe();
      this.toastService.success('updateOk');
      this.subscriptions.add(subscription);
    } else {
      tarea.estado = 'PENDIENTE' as Estado;
      debugger;
      if (!this.esAdmin) {
        tarea.usuario_responsable = this.data.currentUserId;
      }
      const subscription = this.tareaService.createTarea(tarea).subscribe();
      this.toastService.success('createOk');
      this.subscriptions.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
