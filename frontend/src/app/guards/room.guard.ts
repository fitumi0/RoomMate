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
          return true;
        } else {
          // If the room does not exist, return a UrlTree to redirect
          return router.createUrlTree(['/room-404']);
        }
      }),
      catchError((err) => {
        return of(router.createUrlTree(['/']));
      })
    );
  };
}
