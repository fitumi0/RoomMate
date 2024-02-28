import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  data: any;
  constructor(private router: Router,
    private auth: AuthServiceService) {}

  goSignin(){
    this.router.navigate(['/signin']);
  }

  goSignup(){
    this.router.navigate(['/signup']);
  }
}
