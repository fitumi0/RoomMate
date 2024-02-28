import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { SettingsComponent } from '../../components/settings/settings.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [HeaderComponent, CommonModule, PlayerComponent, SettingsComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  roomId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
      console.log(`Room UID: ${this.roomId}`);
    });
  }
}
