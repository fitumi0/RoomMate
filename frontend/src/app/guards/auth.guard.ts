import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

export function authGuard(): CanActivateFn {
  return () => {
    const auth: AuthServiceService = inject(AuthServiceService);
    const router: Router = inject(Router);

    if (!auth.isAuthSig()) {
      router.navigate(['/signin']);
    }

    return auth.isAuthSig();
  };
}
