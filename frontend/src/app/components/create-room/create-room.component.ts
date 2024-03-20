import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from '../../services/room/room.service';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';
import { IUser } from '../../interfaces/IUser';
import { Subject, Subscription, delay, takeUntil } from 'rxjs';
import { IRoomUid } from '../../interfaces/IRoomUid';
import { Router } from '@angular/router';
import { UUID } from 'crypto';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [
    MatIconModule,
    IconSizeDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
})
export class CreateRoomComponent implements OnDestroy {
  roomData: FormGroup;
  user: IUser | undefined;
  isSubmitting = false;
  private $unsubscribe = new Subject<void>();
  constructor(
    public readonly dialogRef: MatDialogRef<CreateRoomComponent>,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly roomService: RoomService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {
    this.roomData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      public: new FormControl(true),
    });

    this.store
      .select(userSelector)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((user) => {
        this.user = user;
      });
  }
  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }


  onExit(result?: UUID): void {
    this.dialogRef.close(result);

    if (result) {
      this.router.navigate([`/room/${result}`]);
    }
  }
  

  onSubmit() {
    if (this.roomData.valid) {
      this.isSubmitting = true;
      this.roomData.get('public')?.disable();
      this.roomData.get('name')?.disable();
      this.roomService
        .createRoom({
          name: this.roomData.get('name')?.value,
          public: this.roomData.get('public')?.value,
          creatorId: this.user?.id ? this.user?.id : '',
        })
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((result: any) => {
          console.log('result', result);

          this.toastr.success(`Room created with id ${result.id}`, 'Success');
          this.onExit(result.id);
        })
        .add(() => {
          this.isSubmitting = false;
          this.roomData.get('public')?.enable();
          this.roomData.get('name')?.enable();
          this.cdr.detectChanges();
        });
    }
  }
}
