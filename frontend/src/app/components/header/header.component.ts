import { CommonModule } from '@angular/common';
import { Component, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
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
}
