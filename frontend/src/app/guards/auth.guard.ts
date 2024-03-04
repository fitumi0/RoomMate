import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Function that checks if the user is authenticated.
 * If the user is not authenticated, it redirects to the sign-in page.
 * 
 * @returns CanActivateFn
 */
export function authGuard(): CanActivateFn {
  return () => {
    const auth: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    if (!auth.isAuthSig()) {
      router.navigate(['/signin']);
    }

    return auth.isAuthSig();
  };
}
