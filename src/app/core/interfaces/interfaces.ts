export enum Rol {
    admin = 'ROLE_ADMIN',
    user = 'ROLE_USER'
}

export enum Estado {
    pendiente = 'TAREA_PENDIENTE',
    en_progreso = 'TAREA_EN_PROGRESO',
    completada = 'TAREA_COMPLETADA',
}

export interface Usuario {
    id: string;
    nombre: string;
    user: string;
    pass: string;
    role: Rol;
}

export interface Tarea {
    id: string;
    nombre: string;
    descripcion: string;
    estado: Estado;
    usuario_responsable: string;
}
