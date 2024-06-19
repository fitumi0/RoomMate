import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Function that checks if the user is authenticated.
 * If the user is not authenticated, it redirects to the sign-in page.
 *
 * @returns CanActivateFn
 */
export function authGuard(): CanActivateFn {
    return (): Observable<boolean> => {
        console.log('from authGuard');
        const auth: AuthService = inject(AuthService);
        const router: Router = inject(Router);

        if (isPlatformBrowser(inject(PLATFORM_ID))) {
            return auth.getUser().pipe(
                map(user => {
                    if (user) {
                        console.log('user', user);
                        return true;
                    } else {
                        console.log('no user');
                        router.navigate(['/signin']);
                        return false;
                    }
                }),
                catchError(() => {
                    console.log('error fetching user');
                    router.navigate(['/signin']);
                    return [false];
                })
            );
        } else {
            return new Observable<boolean>(observer => {
                observer.next(false);
                observer.complete();
            });
        }
    };
}
