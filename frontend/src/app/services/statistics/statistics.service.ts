import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { platform } from 'os';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private http: HttpClient,
    private readonly toastr: ToastrService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {}

  // Потенциально потом перепишется на получение статистики из сокетов,
  // наверняка потребуется реактивность для получения активных комнат на лету не перезагружая страницу
  getActiveRooms(): Observable<Object> {
    return this.http.get('api/get-active-rooms').pipe(
      catchError((err) => {
        if (isPlatformBrowser(this.platform)) {
          // Если бесит, можно убрать в консоль
          this.toastr.error('Error to get active rooms', 'Error');
          console.error('Error to get active rooms');
        }
        throw new Error(err.message);
      })
    );
  }
}
