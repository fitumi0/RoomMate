import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISignInDto } from '../interfaces/ISignInDto';
import { catchError, map, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISignUpDto } from '../interfaces/ISignUpDto';
import { environment } from '../../environments/environment';
import { IUser } from '../interfaces/IUser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { changeUser } from '../reducers/user';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  signIn(userData: ISignInDto) {
    return this.http
      .post<IUser>(`${environment.apiUrl}/api/login`, userData)
      .pipe(
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }

  signUp(userData: ISignUpDto) {
    return this.http
      .post<IUser>(`${environment.apiUrl}/api/sign-up`, userData)
      .pipe(
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }

  signUpTest(userData: ISignUpDto) {
    return this.http
      .post<IUser>(`${environment.apiUrl}/api/sign-up`, userData)
      .pipe(
        map(() => ({
          id: 'test',
          username: 'test',
          token: 'test',
          name: 'test',
          email: 'test@test.test',
        })),
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }

  signInTest(userData: ISignInDto) {
    return this.http
      .post<IUser>(`${environment.apiUrl}/api/login`, userData)
      .pipe(
        map(() => ({
          id: 'test',
          username: 'test',
          token: 'test',
          name: 'test',
          email: 'test@test.test',
        })),
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }
}
