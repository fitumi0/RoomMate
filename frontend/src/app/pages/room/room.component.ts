import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  afterRender,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SettingsComponent } from '../../components/settings/settings.component';
import { Subscription, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { RoomService } from '../../services/room/room.service';
import { SocketService } from '../../services/sockets/socket.service';
import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Producer, Transport } from 'mediasoup-client/lib/types';
import { PlayerComponent } from '../../components/player/player.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [HeaderComponent, CommonModule, PlayerComponent, SettingsComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit, OnDestroy {
  player!: PlayerComponent;
  roomId: string = '';
  device!: mediasoupClient.Device;
  stream!: MediaStream;
  private eventSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private socketService: SocketService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.device = new mediasoupClient.Device();
      (window as any)['device'] = this.device;
      //   this.player =
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('Room component initialized');
    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
      console.log(`Room UID: ${this.roomId}`);
    });

    this.eventSubscription = this.socketService
      .onEvent('user-connected')
      .subscribe((socketId) => {
        console.log(`User connected with ID: ${socketId}`);
      });

    this.eventSubscription = this.socketService
      .onEvent('user-disconnected')
      .subscribe((socketId) => {
        console.log(`User disconnected with ID: ${socketId}`);
      });

    this.eventSubscription = this.socketService
      .onEvent('newProducer')
      .subscribe(() => {
        console.log('New producer created');
      });

    this.socketService.sendMessage('joinRoom', this.roomId);

    this.socketService.sendMessage(
      'getRouterRtpCapabilities',
      async (rtpCapabilities: RtpCapabilities) => {
        console.log('RTP Capabilities: ', rtpCapabilities);

        await this.loadDevice(rtpCapabilities);
      }
    );

    // this.socketService.sendMessage('createConsumerTransport', (params: any) => {
    //   if (params.error) {
    //     console.error('createConsumerTransport: ', params.error);
    //   }

    //   console.log('createConsumerTransport: ', params);

    //   const transport = this.device.createRecvTransport(params);

    //   transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    //     try {
    //       this.socketService.sendMessage('connectConsumerTransport', {
    //         transportId: transport.id,
    //         dtlsParameters,
    //       });
    //     } catch (err) {
    //       console.error(err);
    //     }
    //     callback();
    //   });

    //   this.socketService.sendMessageCallback(
    //     'consume',
    //     { rtpCapabilities: this.device.rtpCapabilities },
    //     async (data: any) => {
    //       const consumer = await transport.consume({
    //         id: data.id,
    //         producerId: data.producerId,
    //         kind: data.kind,
    //         rtpParameters: data.rtpParameters,
    //       });
    //       const stream = new MediaStream();
    //       stream.addTrack(consumer.track);

    //       console.log(stream);
    //     }
    //   );
    // });
  }

  startScreenShare(data: string) {
    this.socketService.sendMessage(
      'createProducerTransport',
      async (params: any) => {
        if (params.error) {
          console.error('createProducerTransport: ', params.error);
        }

        // console.log('createProducerTransport: ', params);

        const transport = this.device.createSendTransport(params);

        transport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              this.socketService.sendMessage('connectProducerTransport', {
                transportId: transport.id,
                dtlsParameters,
              });
            } catch (err) {
              console.error(err);
            }
            callback();
          }
        );

        transport.on(
          'produce',
          async ({ kind, rtpParameters }, callback, errback) => {
            this.socketService.sendMessageCallback(
              'produce',
              {
                kind,
                rtpParameters,
              },
              (id: any) => {
                callback({ id });
              }
            );
          }
        );

        const stream = await navigator.mediaDevices
          .getDisplayMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            // stream.getVideoTracks()[0].addEventListener('ended', () => {
            //   transport.close();
            // });
            // return stream
            this.stream = stream;
            this.cdr.markForCheck();
          });

        transport.produce({
          track: this.stream.getVideoTracks()[0],
        });

        // this.player.setStream(stream);

        this.stream.getVideoTracks()[0].addEventListener('ended', () => {
          console.log('ended');
          transport.close();
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities): Promise<void> {
    await this.device.load({ routerRtpCapabilities });
  }

  // async startScreenShare() {
  //   this.stream = await navigator.mediaDevices.getDisplayMedia({
  //     video: true,
  //     audio: true,
  //   });
  // }

  async consume(transport: Transport) {
    const rtpCapabilities = this.device.rtpCapabilities;
    // emit consume event with data.rtpCapabilities and callback
    this.socketService.sendMessage('consume', {
      rtpCapabilities: rtpCapabilities,
      callback: async (data: any) => {
        console.log('Consumer created');
        const consumer = await transport.consume({
          id: data.id,
          producerId: data.producerId,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        });
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        return stream;
      },
    });
  }
}
