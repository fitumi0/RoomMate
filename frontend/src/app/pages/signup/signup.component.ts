import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FooterComponent, SignupFormComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {}
