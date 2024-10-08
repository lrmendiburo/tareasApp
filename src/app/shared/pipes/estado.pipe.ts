import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado',
  standalone: true
})
export class EstadoPipe implements PipeTransform {

  transform(estado: string): string {

    switch (estado) {
      case 'TAREA_EN_PROGRESO':
        return 'En Progreso';
      case 'TAREA_COMPLETADA':
        return 'Completada';
      default:
        return 'Pendiente';
    }
  }

}
