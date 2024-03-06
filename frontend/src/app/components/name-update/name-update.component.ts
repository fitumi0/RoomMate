import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-name-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './name-update.component.html',
  styleUrl: './name-update.component.scss',
})
export class NameUpdateComponent {
  formData: FormGroup;
  isSubmitting = false;

  constructor() {
    this.formData = new FormGroup({
      newName: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit() {}
}
