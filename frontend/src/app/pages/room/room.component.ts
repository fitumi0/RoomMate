import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  afterRender,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SettingsComponent } from '../../components/settings/settings.component';
import { Subscription, take } from 'rxjs';
import { SocketService } from '../../services/sockets/socket.service';
import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Producer, Transport, Consumer } from 'mediasoup-client/lib/types';
import { PlayerComponent } from '../../components/player/player.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { MediaPlayerElement, MediaProviderElement } from 'vidstack/elements';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    PlayerComponent,
    SettingsComponent,
    ChatComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit, OnDestroy {
  player!: PlayerComponent;
  roomId: string = '';
  device!: mediasoupClient.Device;
  stream!: MediaStream;
  screenSharing = false;
  isBrowser = isPlatformBrowser(this.platformId);
  private eventSubscription!: Subscription;
  showChat = true;
  private sendTransport!: Transport;
  private recvTransport!: Transport;
  private micProducer!: Producer;
  private camProducer!: Producer;
  private screenVideoProducer!: Producer;
  private screenAudioProducer!: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private webcams: Map<string, MediaDeviceInfo> = new Map();

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
      (window as any)['stream'] = this.stream;
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.params.subscribe((params) => {
      this.roomId = params['uid'];
    });

    this.eventSubscription = this.socketService
      .onEvent('user-connected')
      .subscribe((socketId) => {
        // console.log(`User connected with ID: ${socketId}`);
      });

    this.eventSubscription = this.socketService
      .onEvent('user-disconnected')
      .subscribe((socketId) => {
        // console.log(`User disconnected with ID: ${socketId}`);
      });

    this.eventSubscription = this.socketService
      .onEvent('newProducer')
      .subscribe((producerId) => {
        console.log('New producer created');
        this.consume(producerId);
      });

    this.socketService.sendMessageCallback(
      'joinRoom',
      this.roomId,
      (roomId: string) => {}
    );

    this.socketService.sendMessage(
      'getRouterRtpCapabilities',
      async (rtpCapabilities: RtpCapabilities) => {
        await this.loadDevice(rtpCapabilities);
      }
    );
  }

  async consume(producerId: any) {
    if (!this.recvTransport) {
      this.recvTransport = await this.createConsumerTransport();
    }

    this.socketService.sendMessageCallback(
      'consume',
      { producerId: producerId, rtpCapabilities: this.device.rtpCapabilities },
      async (data: any) => {
        const consumer = await this.recvTransport.consume({
          id: data.id,
          producerId: data.producerId,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        });

        this.consumers.set(consumer.id, consumer);
      }
    );

    const stream = new MediaStream();

    this.consumers.forEach((consumer) => {
      stream.addTrack(consumer.track);
    });

    console.log(this.consumers);

    this.stream = stream;
    this.socketService.sendMessage('resume', null);
    this.cdr.markForCheck();
    console.log('shared stream:', {
      this: this.stream,
      current: stream,
    });
  }

  async startScreenShare() {
    if (!this.sendTransport) {
      this.createProducerTransport();
    }

    await navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.stream = stream;
        console.log('create stream ', this.stream);
        this.screenSharing = true;
        this.cdr.markForCheck();

        this.stream.getVideoTracks()[0].addEventListener('ended', () => {
          console.log('stream ended');
          this.socketService.sendMessage('stopProducing', null);
          this.screenSharing = false;
          this.cdr.detectChanges();
        });
      });

    this.screenVideoProducer = await this.sendTransport.produce({
      track: this.stream.getVideoTracks()[0],
    });

    this.screenAudioProducer = await this.sendTransport.produce({
      track: this.stream.getAudioTracks()[0],
    });
  }

  async stopScreenShare() {}

  /*
  async startVideo() {
    if (!this.sendTransport) {
      this.createProducerTransport();
    }

    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.stream = stream;
        console.log('create stream ', this.stream);
        this.cdr.markForCheck();

        // this.stream.getVideoTracks()[0].addEventListener('ended', () => {
        //   console.log('stream ended');
        //   this.socketService.sendMessage('stopProducing', null);
        //   this.screenSharing = false;
        //   this.cdr.detectChanges();
        // });
      });

    this.camProducer = await this.sendTransport.produce({
      track: this.stream.getVideoTracks()[0],
    });

    this.micProducer = await this.sendTransport.produce({
      track: this.stream.getAudioTracks()[0],
    });
  }
  */

  //   async disableShare()
  //   {
  //       if (!this._shareProducer)
  //           return;

  //       this._shareProducer.close();

  //       store.dispatch(
  //           stateActions.removeProducer(this._shareProducer.id));

  //       try
  //       {
  //           await this._protoo.request(
  //               'closeProducer', { producerId: this._shareProducer.id });
  //       }
  //       catch (error)
  //       {
  //           store.dispatch(requestActions.notify(
  //               {
  //                   type : 'error',
  //                   text : `Error closing server-side share Producer: ${error}`
  //               }));
  //       }

  //       this._shareProducer = null;
  //   }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  createProducerTransport() {
    this.socketService.sendMessage(
      'createProducerTransport',
      async (params: any) => {
        if (params.error) {
          console.error('createProducerTransport: ', params.error);
        }

        this.sendTransport = this.device.createSendTransport(params);

        this.sendTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              this.socketService.sendMessage('connectProducerTransport', {
                transportId: this.sendTransport.id,
                dtlsParameters,
              });
            } catch (err) {
              console.error(err);
            }
            callback();
          }
        );

        this.sendTransport.on(
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
      }
    );
  }

  async createConsumerTransport(): Promise<Transport> {
    return new Promise<Transport>((resolve, reject) => {
      this.socketService.sendMessage(
        'createConsumerTransport',
        async (params: any) => {
          if (params.error) {
            console.error('createConsumerTransport: ', params.error);
            reject(params.error);
          }

          let recvTransport = this.device.createRecvTransport(params);

          recvTransport.on(
            'connect',
            async ({ dtlsParameters }, callback, errback) => {
              try {
                this.socketService.sendMessage('connectConsumerTransport', {
                  dtlsParameters,
                });
              } catch (err) {
                console.error(err);
              }
              callback();
            }
          );

          resolve(recvTransport);
        }
      );
    });
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities): Promise<void> {
    await this.device.load({ routerRtpCapabilities });
  }

  toggleChat($event: boolean) {
    this.showChat = $event;
    this.cdr.markForCheck();
  }
}
