import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private url = environment.apiUrl;

  constructor() {
    this.socket = io(this.url);
    (window as any)['socket'] = this.socket;
  }

  public onEvent(event: string): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, (data: Event | undefined) => observer.next(data));
    });
  }

  // Отправка сообщения
  public sendMessage(event: string, message: any): void {
    this.socket.emit(event, message);
  }
}
