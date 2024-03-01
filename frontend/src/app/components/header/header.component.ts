import { CommonModule } from '@angular/common';
import { Component, isDevMode } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';
import { map, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconSizeDirective, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router, public store: Store) {}
  $user = this.store.select(userSelector).pipe(
    map((user) => (user.id ? true : false)),
    tap((user) => {
      if (isDevMode()) {
        console.log('User from header: ', user);
      }
    })
  );

  goSignin() {
    this.router.navigate(['/signin']);
  }

  goSignup() {
    this.router.navigate(['/signup']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }
}
