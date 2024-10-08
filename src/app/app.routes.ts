import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'usuarios', loadComponent: () => import('./core/components/usuarios/usuarios.component').then(c => c.UsuariosComponent) },
    { path: 'tareas', loadComponent: () => import('./core/components/tareas/tareas.component').then(c => c.TareasComponent) },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];