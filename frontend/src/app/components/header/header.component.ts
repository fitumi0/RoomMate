import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    public readonly auth: AuthService,
    public readonly toast: ToastrService
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

  inviteFriend() {
    // copy url to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url);

    this.toast.success('Invite link copied to clipboard!');
  }
}
