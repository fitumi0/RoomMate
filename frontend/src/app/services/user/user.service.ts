import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { IUserNameDto } from '../../interfaces/IUserNameDto';
import { Observable, catchError, tap } from 'rxjs';
import { changeUser } from '../../reducers/user';
import { IUser } from '../../interfaces/IUser';
import { IUserUsernameDto } from '../../interfaces/IUserUsernameDto';
import { IUserPasswordDto } from '../../interfaces/IUserPasswordDto';
import { IUserdataDto } from '../../interfaces/IUserdataDto';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private readonly http: HttpClient,
        private readonly toastr: ToastrService,
        private readonly store: Store
    ) {}

    updateName(name: IUserNameDto): Observable<IUser> {
        return this.http.patch<IUser>('api/update-user-name', name).pipe(
            tap((data: IUser) => {
                this.store.dispatch(changeUser(data));
            }),
            catchError((err) => {
                this.toastr.error(err.error.message, 'Error');
                throw new Error(err.message);
            })
        );
    }

    updateUsername(username: IUserUsernameDto): Observable<IUser> {
        return this.http
            .patch<IUser>('api/update-user-username', username)
            .pipe(
                tap((data: IUser) => {
                    this.store.dispatch(changeUser(data));
                }),
                catchError((err) => {
                    this.toastr.error(err.error.message, 'Error');
                    throw new Error(err.message);
                })
            );
    }

    updatePassword(passwords: IUserPasswordDto): Observable<IUser> {
        return this.http
            .patch<IUser>('api/update-user-password', passwords)
            .pipe(
                catchError((err) => {
                    this.toastr.error(err.error.message, 'Error');
                    throw new Error(err.message);
                })
            );
    }

    updateUserdata(data: IUserdataDto) {
        return this.http.patch<IUser>('api/update-user', data).pipe(
            catchError((err) => {
                this.toastr.error(err.error.message, 'Error');
                throw new Error(err.message);
            })
        );
    }
}
