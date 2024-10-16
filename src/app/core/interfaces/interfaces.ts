export enum Rol {
    admin = 'ADMIN',
    user = 'USER'
}

export enum Estado {
    pendiente = 'PENDIENTE',
    en_progreso = 'EN_PROGRESO',
    completada = 'COMPLETADA',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Rol;
}

export interface Tarea {
    id: string;
    nombre: string;
    descripcion: string;
    estado: Estado;
    usuario_responsable: string;
}
