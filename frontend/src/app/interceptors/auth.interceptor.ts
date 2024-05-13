import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PLATFORM_ID, inject, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Interceptor that adds an authorization token to outgoing HTTP requests.
 * If the user is authenticated, the token is retrieved from local storage.
 * 
 * @remarks
 * - This interceptor is used to attach an `Authorization` header to requests.
 * - It checks if the user is authenticated and retrieves the token from local storage.
 * - The token is then added to the request headers.
 * 
 * @example
 * ```
 * // Usage in an Angular service or module:
 * providers: [
 *   {
 *     provide: HTTP_INTERCEPTORS,
 *     useClass: AuthInterceptor,
 *     multi: true,
 *   },
 * ],
 * ```
 */
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const platformId = inject(PLATFORM_ID)

    let token;
    if (isPlatformBrowser(platformId)) {
      token = localStorage.getItem('token') as string;
    }
    if (isDevMode()) {
      console.log('From interceptor: ', token);
    }

    if (token && token !== 'undefined') {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        url: `${environment.apiUrl}/${req.url}`,
      });
    } else {
      req = req.clone({
        url: `${environment.apiUrl}/${req.url}`,
      });
    }
    return next.handle(req);
  }
}
