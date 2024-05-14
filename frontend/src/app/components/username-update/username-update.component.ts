import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-username-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './username-update.component.html',
  styleUrl: './username-update.component.scss',
})
export class UsernameUpdateComponent implements OnDestroy {
  formData: FormGroup;
  isSubmitting = false;
  $unsubscribe = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly userService: UserService,
    private readonly toastr: ToastrService
  ) {
    this.formData = new FormGroup({
      newUsername: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log('Form submitted');
      this.isSubmitting = true;
      this.formData.get('newUsername')?.disable();
      this.userService
        .updateUsername(this.formData.value)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(() => {
          this.toastr.success('Username updated successfully', 'Success');
          this.formData.reset();
        })
        .add(() => {
          this.isSubmitting = false;
          this.formData.get('newUsername')?.enable();
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
