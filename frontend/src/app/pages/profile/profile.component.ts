import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Store } from '@ngrx/store';
import { changeUser } from '../../reducers/user';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NameUpdateComponent } from '../../components/name-update/name-update.component';
import { UsernameUpdateComponent } from '../../components/username-update/username-update.component';
import { PasswordUpdateComponent } from '../../components/password-update/password-update.component';
import { AccordionComponent } from '../../components/accordion/accordion.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AccordionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  forms: { title: string, component: any }[] = [
    { title: 'Update Name', component: NameUpdateComponent },
    { title: 'Update Username', component: UsernameUpdateComponent },
    { title: 'Update Password', component: PasswordUpdateComponent }
  ];
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
