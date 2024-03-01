import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { userSelector } from '../reducers/user';
import { map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

export function authGuard(): CanActivateFn {
  return () => {
    const store: Store = inject(Store);
    const router: Router = inject(Router);

    let canActivate = false;
    store
      .select(userSelector)
      .pipe(
        take(1),
        map((user) => (user.id && user.token ? true : false))
      )
      .subscribe((isAuthenticated) => {
        canActivate = isAuthenticated;
        if (!isAuthenticated) {
          router.navigate(['/signin']);
        }
      });

    return canActivate;
  };
}
