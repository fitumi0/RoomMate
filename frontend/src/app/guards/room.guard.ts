import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of, take, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from '../services/room.service';

export function roomValidateGuard(): CanActivateFn {
  return (route, state) => {
    const router: Router = inject(Router);
    const roomService: RoomService = inject(RoomService);

    const roomId = route.params['uid'];
    return roomService.getRoom(roomId).pipe(
      map((exists) => {
        if (exists) {
          // If the room exists, return true
          return true;
        } else {
          // If the room does not exist, return a UrlTree to redirect
          return router.createUrlTree(['/room-404']);
        }
      }),
      catchError((err) => {
        // On error, redirect to a different route
        return of(router.createUrlTree(['/']));
      })
    );
  };
}
