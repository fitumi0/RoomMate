import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import * as io from 'socket.io-client';
import { IRoomCreateDto } from '../../interfaces/IRoomCreateDto';
import { ToastrService } from 'ngx-toastr';
import { IRoomUid } from '../../interfaces/IRoomUid';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}
  getRoom(roomId: string): Observable<Object> {
    return this.http.get(`api/get-room/${roomId}`);
  }

  getPublicRooms(): Observable<Object> {
    return this.http.get('api/get-public-rooms');
  }

  createRoom(data: IRoomCreateDto): Observable<Object> {
    return this.http.post<IRoomUid>('api/create-room', data).pipe(
      catchError((err) => {
        this.toastr.error(err.error.message, 'Error');
        throw new Error(err.message);
      })
    );
  }

  createRoomTest(data: IRoomCreateDto): Observable<Object> {
    return of<IRoomUid>({uid: 'fsdfsdfsdfsdfsdfsdfsdfsdfsd'}).pipe(
      catchError((err) => {
        this.toastr.error(err.error.message, 'Error');
        throw new Error(err.message);
      })
    );
  }
}
