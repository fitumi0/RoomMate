import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [HeaderComponent, CommonModule, PlayerComponent, SettingsComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  roomId: string = '';
  test: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
      this.test = this.http
        .get(`api/get-room/${this.roomId}`)
        .subscribe((data) => {
          console.log(data);
        });
      console.log(`Room UID: ${this.roomId}`);
    });
  }
}
