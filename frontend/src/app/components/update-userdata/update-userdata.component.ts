import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { IUser } from '../../interfaces/IUser';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';
import { MatchValidationService } from '../../services/match-validation/match-validation.service';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { IUserdataDto } from '../../interfaces/IUserdataDto';
import { U } from 'vidstack/dist/types/vidstack-9WSEN2It';

@Component({
    selector: 'app-update-userdata',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './update-userdata.component.html',
    styleUrl: './update-userdata.component.scss',
})
export class UpdateUserdataComponent {
    formData: FormGroup;
    isSubmitting = false;
    user!: IUser;
    $unsubscribe = new Subject<void>();
    constructor(
        public readonly auth: AuthService,
        private readonly store: Store,
        private readonly matchService: MatchValidationService,
        private readonly userService: UserService,
        private readonly toastr: ToastrService,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.store
            .select(userSelector)
            .pipe(take(1))
            .subscribe((user) => {
                if (user) {
                    this.user = user;
                }
            });
        this.formData = new FormGroup(
            {
                newUsername: new FormControl(this.user.username, [
                    Validators.minLength(4),
                ]),
                newName: new FormControl(this.user.name),
                currentPassword: new FormControl('', [Validators.minLength(6)]),
                newPassword: new FormControl('', [Validators.minLength(6)]),
                confirmPassword: new FormControl('', [Validators.minLength(6)]),
                newEmail: new FormControl(this.user.email, [Validators.email]),
            },
            {
                validators: this.matchService.mustMatch(
                    'newPassword',
                    'confirmPassword'
                ),
            }
        );
    }

    onSubmit() {
        if (!this.formData.valid) {
            console.log('Form not submitted');
        }

        console.log('Form submitted');
        this.isSubmitting = true;
        this.formData.get('newUsername')?.disable();
        this.formData.get('newName')?.disable();
        this.formData.get('currentPassword')?.disable();
        this.formData.get('newPassword')?.disable();
        this.formData.get('confirmPassword')?.disable();
        this.formData.get('newEmail')?.disable();

        const userdata: IUserdataDto = {
            name: this.formData.get('newName')?.value,
            username: this.formData.get('newUsername')?.value,
            email: this.formData.get('newEmail')?.value,
            currentPassword: this.formData.get('currentPassword')?.value,
            newPassword: this.formData.get('newPassword')?.value,
            confirmPassword: this.formData.get('confirmPassword')?.value,
        };
        this.userService
            .updateUserdata(userdata)
            .pipe(takeUntil(this.$unsubscribe))
            .subscribe(() => {
                this.toastr.success('Userdata updated successfully', 'Success');
                this.formData.reset();
            })
            .add(() => {
                this.isSubmitting = false;
                this.formData.get('newUsername')?.enable();
                this.formData.get('newName')?.enable();
                this.formData.get('currentPassword')?.enable();
                this.formData.get('newPassword')?.enable();
                this.formData.get('confirmPassword')?.enable();
                this.formData.get('newEmail')?.enable();
                this.cdr.detectChanges();
            });
    }
}
