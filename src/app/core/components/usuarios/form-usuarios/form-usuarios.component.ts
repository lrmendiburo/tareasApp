import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Rol } from '../../../interfaces/interfaces';
import { MatSelectModule } from '@angular/material/select';

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

  myForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    user: ['', Validators.required],
    pass: ['', Validators.required],
    role: ['', Validators.required],
  })

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    (this.esEditar) ? this.title = "Editar Usuario" : this.title = "Crear Usuario";
  }

}
