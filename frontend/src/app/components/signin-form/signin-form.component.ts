import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.scss',
})
export class SigninFormComponent implements OnDestroy {
  private $unsubscribe = new Subject<void>();
  isSubmitting = false;
  userData: FormGroup;

  constructor(
    private readonly auth: AuthService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.userData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.userData.valid) {
      console.log('Form submitted');

      this.isSubmitting = true;
      this.userData.get('email')?.disable();
      this.userData.get('password')?.disable();
      this.auth
        .signIn(this.userData.value)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(() => {
          this.toastr.success('Sign in successful', 'Success');
        })
        .add(() => {
          console.log('Method add called');
          this.isSubmitting = false;
          this.userData.get('email')?.enable();
          this.userData.get('password')?.enable();
          this.cdr.detectChanges();
        });
    } else {
      console.log('Form not submitted');
    }
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
