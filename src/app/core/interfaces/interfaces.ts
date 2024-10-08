export enum Estado {
    pendiente = 'TAREA_PENDIENTE',
    enprogreso = 'TAREA_EN_PROGRESO',
    completada = 'TAREA_COMPLETADA',
}

export enum Rol {
    admin = 'ROLE_ADMIN',
    user = 'ROLE_USER'
}

export interface Tarea {
    id: string;
    nombre: string;
    descripcion: string;
    estado: Estado;
}

export interface Usuario {
    id: string;
    nombre: string;
    user: string;
    pass: string;
    role: Rol;
    tareas: string[];
}
