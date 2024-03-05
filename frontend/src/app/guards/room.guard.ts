import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of, map, take } from 'rxjs';
import { RoomService } from '../services/room/room.service';

export function roomValidateGuard(): CanActivateFn {
  return (route, state) => {
    const router: Router = inject(Router);
    const roomService: RoomService = inject(RoomService);

    const roomId = route.params['uid'];
    return roomService.getRoom(roomId).pipe(
      take(1),
      map((exists) => {
        if (exists) {
          // If the room exists, return true
          console.log('From room guard: exist');
          return true;
        } else {
          // If the room does not exist, return a UrlTree to redirect
          // This condition does not occur!
          console.log('From room guard: not exist');
          return router.createUrlTree(['/room-404']);
        }
      }),
      catchError((err) => {
        // On error, redirect to a different route
        console.log('From room guard: error');
        return of(router.createUrlTree(['/']));
      })
    );
  };
}
