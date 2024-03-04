import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

export function roomValidateGuard(): CanActivateFn {
  return (route, state) => {
    const http: HttpClient = inject(HttpClient);
    const router: Router = inject(Router);
    const toastr: ToastrService = inject(ToastrService);

    const roomId = route.paramMap.get('uid');
    console.log(`Room UID from room guard: ${roomId}`);

    let authentecated = false;
    http
      .get(`api/get-room/${roomId}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          toastr.error('No access to this room', 'Error');
          router.navigate(['/']);
          throw new Error(err.message);
        }),
        take(1)
      )
      .subscribe((data) => {
        if (data) {
          authentecated = true;
        }
      });

    return authentecated;
  };
}
