import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-username-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './username-update.component.html',
  styleUrl: './username-update.component.scss',
})
export class UsernameUpdateComponent {
  formData: FormGroup;
  isSubmitting = false;

  constructor() {
    this.formData = new FormGroup({
      newUsername: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit() {}
}
