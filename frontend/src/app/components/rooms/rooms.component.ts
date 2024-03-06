import { CommonModule } from '@angular/common';
import { Component, isDevMode } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateRoomComponent } from '../create-room/create-room.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  roomsGroup: FormGroup;
  test: any;
  roomId = 'test';
  constructor(
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    this.roomsGroup = new FormGroup({
      roomUid: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.roomsGroup.valid) {
      if (isDevMode()) {
        console.log(
          'Room UID from form: ',
          this.roomsGroup.get('roomUid')?.value
        );
      }
      this.router.navigate(['room', this.roomsGroup.get('roomUid')?.value]);
    } else {
      this.toastr.error('Invalid room ID', 'Error');
    }
  }

  //   getPublicRooms() {
  //     this.roomService.getPublicRooms().pipe(
  //       take(100),
  //       map((rooms) => {
  //         console.log(rooms);
  //         return rooms;
  //       })
  //     );
  //   }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '320px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Received room UID: ', result.uid);
        // this.router.navigate(['room', result]);
      }
    });
  }
}
