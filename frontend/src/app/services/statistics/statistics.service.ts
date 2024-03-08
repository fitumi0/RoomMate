import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  // Потенциально потом перепишется на получение статистики из сокетов,
  // наверняка потребуется реактивность для получения активных комнат на лету не перезагружая страницу
  getActiveRooms(): Observable<Object> {
    return this.http.get('api/get-active-rooms');
  }
}
