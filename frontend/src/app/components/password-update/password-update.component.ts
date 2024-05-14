import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-password-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.scss',
})
export class PasswordUpdateComponent implements OnDestroy {
  formData: FormGroup;
  isSubmitting = false;
  $unsubscribe = new Subject<void>();
  constructor(
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef,
    private readonly userService: UserService
  ) {
    this.formData = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log('Form submitted');
      this.isSubmitting = true;
      this.formData.get('currentPassword')?.disable();
      this.formData.get('newPassword')?.disable();
      this.userService
        .updatePassword(this.formData.value)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(() => {
          this.toastr.success('Password updated successfully', 'Success');
          this.formData.reset();
        })
        .add(() => {
          this.isSubmitting = false;
          this.formData.get('currentPassword')?.enable();
          this.formData.get('newPassword')?.enable();
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
