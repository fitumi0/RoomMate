import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ISignInDto } from '../interfaces/ISignInDto';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISignUpDto } from '../interfaces/ISignUpDto';
import { IUser } from '../interfaces/IUser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { changeUser } from '../reducers/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthSig = signal<boolean>(false);
  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  signIn(userData: ISignInDto): Observable<IUser> {
    return this.http
      .post<IUser>(`/api/login`, userData, {
        headers: { withCredentials: 'true' },
      })
      .pipe(
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.isAuthSig.set(true);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }

  signUp(userData: ISignUpDto): Observable<IUser> {
    return this.http
      .post<IUser>(`/api/sign-up`, userData, {
        headers: { withCredentials: 'true' },
      })
      .pipe(
        tap((user: IUser) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(changeUser(user));
          this.isAuthSig.set(true);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.toastr.error(err.error.message, 'Error');
          throw new Error(err.message);
        })
      );
  }

  getUser(): Observable<IUser | null> {
    return this.http
      .get<IUser | null>(`/api/user`, {
        headers: { withCredentials: 'true' },
      })
      .pipe(
        tap((user: IUser | null) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.isAuthSig.set(true);
            this.store.dispatch(changeUser(user));
          }
        }),
        catchError((err) => {
          throw new Error(err.message);
        })
      );
  }

  signUpTest(userData: ISignUpDto): Observable<IUser> {
    return of({
      id: userData.email,
      username: userData.username,
      token: 'test',
      name: 'test',
      email: userData.email,
    }).pipe(
      tap((user: IUser) => {
        localStorage.setItem('token', user.token);
        this.store.dispatch(changeUser(user));
        this.isAuthSig.set(true);
        this.router.navigate(['/']);
      }),
      catchError((err) => {
        this.toastr.error(err.error.message, 'Error');
        throw new Error(err.message);
      })
    );
  }

  signInTest(userData: ISignInDto): Observable<IUser> {
    return of({
      id: userData.email,
      username: 'test',
      token: 'test',
      name: 'test',
      email: userData.email,
    }).pipe(
      tap((user: IUser) => {
        localStorage.setItem('token', user.token);
        this.store.dispatch(changeUser(user));
        this.isAuthSig.set(true);
        this.router.navigate(['/']);
      }),
      catchError((err) => {
        this.toastr.error(err.error.message, 'Error');
        throw new Error(err.message);
      })
    );
  }

  getUserTest(): Observable<IUser | null> {
    return of({
      id: 'test',
      username: 'test',
      token: 'test',
      name: 'test',
      email: 'test@test.test',
    }).pipe(
      tap((user: IUser | null) => {
        if (user && localStorage.getItem('token')) {
          localStorage.setItem('token', user.token);
          this.isAuthSig.set(true);
          this.store.dispatch(changeUser(user));
        }
      }),
      catchError((err) => {
        throw new Error(err.message);
      })
    );
  }
}
