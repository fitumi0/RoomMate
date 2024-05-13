import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatchValidationService } from '../../services/match-validation/match-validation.service';

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
  isSubmitting = false;

  constructor(
    private readonly auth: AuthService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef,
    private readonly matchService: MatchValidationService
  ) {
    this.userData = new FormGroup(
      {
        // username: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(8),
        // ]),
        // name: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(8),
        // ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.matchService.mustMatch('password', 'confirmPassword') }
    );
  }

  onSubmit() {
    if (this.userData.valid) {
      this.isSubmitting = true;
      this.userData.get('email')?.disable();
      this.userData.get('password')?.disable();
      this.userData.get('confirmPassword')?.disable();
      //   this.userData.get('username')?.disable();
      this.auth
        .signUp(this.userData.value)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(() => {
          this.toastr.success('Sign up successful', 'Success');
        })
        .add(() => {
          this.isSubmitting = false;
          this.userData.get('email')?.enable();
          this.userData.get('password')?.enable();
          this.userData.get('confirmPassword')?.enable();
          //   this.userData.get('username')?.enable();
          this.cdr.detectChanges();
        });
      console.log('Form submitted');
    } else {
      console.log('Form not submitted');
    }
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
