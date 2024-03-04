import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { Subscription, catchError, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    PlayerComponent,
    SettingsComponent,
    MatIconModule,
    IconSizeDirective,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  roomId: string = '';
  room: Subscription | null = null;
  enableDimmer = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    console.log('Room component initialized');
    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
      this.room = this.roomService
        .getRoom(this.roomId)
        .pipe(
          take(1),
          catchError(() => {
            this.router.navigate(['/']);
            throw new Error('Room not found');
          })
        )
        .subscribe(() => {
          console.log('Room found');
        });
      console.log(`Room UID: ${this.roomId}`);
    });
  }

  onExit(): void {
    this.router.navigate(['/']);
  }
}
