import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io, { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private url = 'http://localhost:4443';

  constructor() {
    this.socket = io(this.url);
    (window as any)['socket'] = this.socket;
  }

  public onEvent(event: string): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

  public sendMessage(event: string, message: any): void {
    this.socket.emit(event, message);
  }
}
