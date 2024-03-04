import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

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
