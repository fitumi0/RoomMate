import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconSizeDirective, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private readonly router: Router,
    public readonly store: Store,
    public readonly auth: AuthService
  ) {}

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
