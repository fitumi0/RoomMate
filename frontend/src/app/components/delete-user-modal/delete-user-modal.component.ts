import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';

@Component({
  selector: 'app-delete-user-modal',
  standalone: true,
  imports: [MatIconModule, IconSizeDirective],
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.scss',
})
export class DeleteUserModalComponent implements OnDestroy {
  $unsubscribe = new Subject<void>();
  constructor(
    public readonly dialogRef: MatDialogRef<DeleteUserModalComponent>,
    private readonly auth: AuthService,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {}

  onConfirm(): void {
    this.store
      .select(userSelector)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((user) => {
        if (user) {
          this.auth
            .deleteUser()
            .pipe(takeUntil(this.$unsubscribe))
            .subscribe(() => {
              this.dialogRef.close();
              this.auth.logOut();
            });
        }
      });
  }

  onExit(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
