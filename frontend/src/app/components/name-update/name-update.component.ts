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
  selector: 'app-name-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './name-update.component.html',
  styleUrl: './name-update.component.scss',
})
export class NameUpdateComponent implements OnDestroy {
  formData: FormGroup;
  isSubmitting = false;
  $unsubscribe = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly toastr: ToastrService,
    private readonly userService: UserService
  ) {
    this.formData = new FormGroup({
      newName: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.formData.valid) {
      console.log('Form not submitted');
    }
    console.log('Form submitted');
    this.isSubmitting = true;
    this.formData.get('newName')?.disable();
    this.userService
      .updateName(this.formData.value)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        this.toastr.success('Name updated successfully', 'Success');
        this.formData.reset();
      })
      .add(() => {
        this.isSubmitting = false;
        this.formData.get('newName')?.enable();
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
