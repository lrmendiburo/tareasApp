import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol',
  standalone: true
})
export class RolPipe implements PipeTransform {

  transform(rol: string): string {

    switch (rol) {
      case 'ROLE_ADMIN':
        return 'Admin';
      default:
        return 'User';
    }
  }

}
