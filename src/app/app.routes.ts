import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./auth/components/login/login.component').then(c => c.LoginComponent) },
    { path: 'tareas', loadComponent: () => import('./core/components/tareas/tareas.component').then(c => c.TareasComponent) ,
            canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN', 'USER'] }},
    { path: 'usuarios', loadComponent: () => import('./core/components/usuarios/usuarios.component').then(c => c.UsuariosComponent),
            canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN'] } },
    { path: '**', component: PageNotFoundComponent }
];