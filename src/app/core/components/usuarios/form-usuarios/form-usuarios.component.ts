import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Rol, User } from '../../../interfaces/interfaces';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosService } from '../../../services/usuarios.service';
import { Subscription, tap } from 'rxjs';
import { ToastMsgService } from '../../../../shared/services/toast-msg.service';

@Component({
  selector: 'app-form-usuarios',
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
  templateUrl: './form-usuarios.component.html',
  styleUrl: './form-usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUsuariosComponent implements OnInit {

  title: string = "Crear Usuario"
  esEditar: boolean = false;
  roles = Object.values(Rol);
  private subscriptions: Subscription = new Subscription();

  myForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required],
  })

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private toastService: ToastMsgService,
    @Inject(MAT_DIALOG_DATA) public usuarioSelectedId: string | null
  ) { }

  ngOnInit(): void {
    if (this.usuarioSelectedId) {
      this.title = "Editar Usuario";
      this.esEditar = true;
      const subscription = this.usuarioService.getUserById(this.usuarioSelectedId).subscribe((usuario) => {
        this.myForm.patchValue(usuario);
      });
      this.subscriptions.add(subscription);
    }
  }

  enviar() {
    const usuario = this.myForm.value as User;
    if (this.esEditar) {
      usuario.id = this.usuarioSelectedId!;
      const subscription = this.usuarioService.updateUser(usuario).subscribe();
      this.toastService.success('updateOk');
      this.subscriptions.add(subscription);
    } else {
      const subscription = this.usuarioService.createUser(usuario).subscribe();
      this.toastService.success('createOk');
      this.subscriptions.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
