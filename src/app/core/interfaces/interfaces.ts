export enum Rol {
    admin = 'ADMIN',
    user = 'USER'
}

export enum Estado {
    pendiente = 'PENDIENTE',
    en_progreso = 'EN_PROGRESO',
    completada = 'COMPLETADA',
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
