import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { Subscription, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { RoomService } from '../../services/room/room.service';
import { SocketService } from '../../services/sockets/socket.service';
import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    PlayerComponent,
    SettingsComponent,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  roomId: string = '';
  device: mediasoupClient.Device = new mediasoupClient.Device();
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private socketService: SocketService
  ) {
    (window as any)['device'] = this.device;
  }

  ngOnInit(): void {
    console.log('Room component initialized');
    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
      console.log(`Room UID: ${this.roomId}`);
    });

    this.socketService.sendMessage(
      'getRouterRtpCapabilities',
      (rtpCapabilities: RtpCapabilities) => {
        console.log('RTP Capabilities: ', rtpCapabilities);

        this.loadDevice(rtpCapabilities);
      }
    );

    this.socketService.sendMessage('createProducerTransport', (params: any) => {
      if (params.error) {
        console.error('createProducerTransport: ', params.error);
      }

      console.log('createProducerTransport: ', params);

      const transport = this.device.createSendTransport(params);

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          this.socketService.sendMessage('connectProducerTransport', {
            transportId: transport.id,
            dtlsParameters,
          });
        } catch (err) {
          console.error(err);
        }
        callback();
      });
    });

    this.socketService.sendMessage('createConsumerTransport', (params: any) => {
      if (params.error) {
        console.error('createProducerTransport: ', params.error);
      }

      console.log('createConsumerTransport: ', params);

      const transport = this.device.createSendTransport(params);

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          this.socketService.sendMessage('connectConsumerTransport', {
            transportId: transport.id,
            dtlsParameters,
          });
        } catch (err) {
          console.error(err);
        }
        callback();
      });
    });
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities): Promise<void> {
    await this.device.load({ routerRtpCapabilities });
  }
}
