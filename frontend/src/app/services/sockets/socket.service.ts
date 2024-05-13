import { Injectable, afterRender, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private url = environment.apiUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io(this.url);
      (window as any)['socket'] = this.socket;
    }
  }

  public onEvent(event: string, message?: any): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(event, (data: any) => {
        if (message) {
          observer.next({ message, data });
        } else {
          observer.next(data);
        }
      });
    });
  }

  public sendMessage(event: string, message: any): void {
    this.socket.emit(event, message);
  }

  public sendMessageCallback(event: string, message: any, callback: any): void {
    this.socket.emit(event, message, callback);
  }
}
