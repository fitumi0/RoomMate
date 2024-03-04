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

export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const platformId = inject(PLATFORM_ID)

    let token = '';
    if (isPlatformBrowser(platformId)) {
      token = localStorage.getItem('token') as string;
    }
    if (isDevMode()) {
      console.log('From interceptor: ', token);
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        url: `${environment.apiUrl}/${req.url}`,
      });
    }
    return next.handle(req);
  }
}
