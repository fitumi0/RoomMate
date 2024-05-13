import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ISignInDto } from '../../interfaces/ISignInDto';
import { Observable, catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISignUpDto } from '../../interfaces/ISignUpDto';
import { IUser } from '../../interfaces/IUser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { changeUser } from '../../reducers/user';
/**
 * Service responsible for user authentication and related functionality.
 *
 * @remarks
 * - This service handles user sign-in, sign-up, and user-related actions.
 * - It interacts with the server using HTTP requests.
 *
 * @example
 * ```
 * // Usage in an Angular component:
 * constructor(private authService: AuthService) {}
 *
 * signIn() {
 *   const credentials = { username: 'user123', password: 'secret' };
 *   this.authService.signIn(credentials).subscribe(
 *     (user) => {
 *       console.log('User signed in:', user);
 *     },
 *     (error) => {
 *       console.error('Sign-in error:', error);
 *     }
 *   );
 * }
 * ```
 */
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

  /**
   * Signs in the user using provided credentials.
   *
   * @param userData - User sign-in data (e.g., username and password).
   * @returns Observable<IUser> - User information including token.
   */
  signIn(userData: ISignInDto): Observable<IUser> {
    return this.http
      .post<IUser>(`api/login`, userData, {
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

  /**
   * Signs up the user using provided registration data.
   *
   * @param userData - User registration data (e.g., username, email, and password).
   * @returns Observable<IUser> - User information including token.
   */
  signUp(userData: ISignUpDto): Observable<IUser> {
    return this.http
      .post<IUser>(`api/sign-up`, userData, {
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

  /**
   * Retrieves the current user information.
   *
   * @returns Observable<IUser | null> - User information or null if not authenticated.
   */
  getUser(): Observable<IUser | null> {
    return this.http
      .get<IUser | null>(`api/get-user`, {
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

  logOut() {
    this.store.dispatch(
      changeUser({ id: '', username: '', email: '', token: '', name: '' })
    );
    localStorage.removeItem('token');
    this.isAuthSig.set(false);
    this.router.navigate(['/']);
  }

  deleteUser(userUid: string) {
    return this.http.delete(`/api/user/${userUid}`).pipe(
      catchError((err) => {
        this.toastr.error(err.error.message, 'Error');
        throw new Error(err.message);
      })
    );
  }
}
