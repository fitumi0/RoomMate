import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent implements OnDestroy {
  userData: FormGroup;
  $unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private readonly auth: AuthServiceService,
    private readonly toastr: ToastrService
  ) {
    this.userData = this.formBuilder.group(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.mustMatch('password', 'confirmPassword') }
    );
  }

  onSubmit() {
    if (this.userData.valid) {
      this.auth
        .signUp(this.userData.value)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(() => {
          this.toastr.success('Sign up successful', 'Success');
        });
      console.log('Form submitted');
    } else {
      console.log('Form not submitted');
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
