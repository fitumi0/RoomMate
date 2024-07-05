import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, isDevMode } from '@angular/core';
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
import { StatisticsService } from '../../services/statistics/statistics.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-rooms',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
    templateUrl: './rooms.component.html',
    styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit, OnDestroy {
    roomsGroup: FormGroup;
    test: any;
    roomId = 'test';
    activeRooms!: Number;
    $unsubscribe = new Subject<void>();
    isSubmitting = false;

    constructor(
        private readonly toastr: ToastrService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly statisticsService: StatisticsService
    ) {
        this.roomsGroup = new FormGroup({
            roomUid: new FormControl('', [Validators.required]),
        });
    }
    ngOnDestroy(): void {
        this.$unsubscribe.next();
        this.$unsubscribe.complete();
    }

    ngOnInit(): void {
        this.statisticsService
            .getActiveRooms()
            .pipe(takeUntil(this.$unsubscribe))
            .subscribe((data: any) => {
                this.activeRooms = data.activeRooms;
            });
    }

    toPublicRooms() {
        this.router.navigate(['active-rooms']);
    }

    onSubmit() {
        if (this.roomsGroup.valid) {
            if (isDevMode()) {
                console.log(
                    'Room UID from form: ',
                    this.roomsGroup.get('roomUid')?.value
                );
            }
            this.router.navigate([
                'room',
                this.roomsGroup.get('roomUid')?.value,
            ]);
            this.isSubmitting = false;
        } else {
            this.isSubmitting = false;
            this.toastr.error('Invalid room ID', 'Error');
        }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(CreateRoomComponent, {
            width: '320px',
            disableClose: true,
            data: {},
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this.$unsubscribe))
            .subscribe((result) => {
                if (result) {
                    console.log('Received room UID: ', result.uid);
                    // this.router.navigate(['room', result]);
                }
            });
    }
}
