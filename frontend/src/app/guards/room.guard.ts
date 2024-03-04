import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export function roomValidateGuard(): CanActivateFn {
  return () => {
    const http: HttpClient = inject(HttpClient);
    const router: Router = inject(Router);
    const route: ActivatedRouteSnapshot = inject(ActivatedRouteSnapshot);

    let roomId = route.paramMap.get('uid');
    console.log(`Room ______ID: ${roomId}`);

    let authentecated = false;
    http
      .get(`api/get-room/${roomId}`)
      .pipe(
        catchError((err) => {
          router.navigate(['/']);
          throw new Error(err.message);
        })
      )
      .subscribe((data) => {
        if (data) {
          authentecated = true;
        }
      });

    return authentecated;
  };
}
