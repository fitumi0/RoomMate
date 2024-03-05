import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private readonly http: HttpClient) {}
  getRoom(roomId: string): Observable<Object> {
    return this.http.get(`api/get-room/${roomId}`);
  }

  getPublicRooms(): Observable<Object> {
    return this.http.get('api/get-public-rooms');
  }
}
