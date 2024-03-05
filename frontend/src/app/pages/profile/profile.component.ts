import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Store } from '@ngrx/store';
import { changeUser } from '../../reducers/user';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  logOut() {
    this.store.dispatch(
      changeUser({ id: '', username: '', email: '', token: '' })
    );
    localStorage.removeItem('token');
    this.auth.isAuthSig.set(false);
    this.router.navigate(['/']);
  }
}
