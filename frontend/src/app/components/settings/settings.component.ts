import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProvidersEnum } from './providers.enum';
import { Store } from '@ngrx/store';
import { changeUrl } from '../../reducers/videoUrl';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../services/sockets/socket.service';
import * as mediasoupClient from 'mediasoup-client';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  @Input() device!: mediasoupClient.Device;
  @Input() player!: PlayerComponent;
  stream!: MediaStream;
  selectedProvider = ProvidersEnum.YouTube;
  videoUrl = '';
  arrayProvidersWithUrl = [ProvidersEnum.YouTube];
  @Output() onSetStream = new EventEmitter<string>();

  constructor(
    private store: Store,
    private readonly toastr: ToastrService,
    private socketService: SocketService
  ) {}

  clickPlay() {
    if (!this.arrayProvidersWithUrl.includes(this.selectedProvider)) {
      return;
    }

    if (!this.videoUrl) {
      this.toastr.error('You must enter a URL', 'Error');
    }

    if (!this.isValidUrl(this.videoUrl)) {
      this.toastr.error('Please enter a valid URL', 'Error');
    }

    this.store.dispatch(changeUrl({ url: this.videoUrl }));
  }

  startScreenShare() {
    this.onSetStream.emit("data");
  

    // this.socketService.sendMessage(
    //   'createProducerTransport',
    //   async (params: any) => {
    //     if (params.error) {
    //       console.error('createProducerTransport: ', params.error);
    //     }

    //     // console.log('createProducerTransport: ', params);

    //     const transport = this.device.createSendTransport(params);

    //     transport.on(
    //       'connect',
    //       async ({ dtlsParameters }, callback, errback) => {
    //         try {
    //           this.socketService.sendMessage('connectProducerTransport', {
    //             transportId: transport.id,
    //             dtlsParameters,
    //           });
    //         } catch (err) {
    //           console.error(err);
    //         }
    //         callback();
    //       }
    //     );

    //     transport.on(
    //       'produce',
    //       async ({ kind, rtpParameters }, callback, errback) => {
    //         this.socketService.sendMessageCallback(
    //           'produce',
    //           {
    //             kind,
    //             rtpParameters,
    //           },
    //           (id: any) => {
    //             callback({ id });
    //           }
    //         );
    //       }
    //     );

    //     const stream = await navigator.mediaDevices.getDisplayMedia({
    //       video: true,
    //       audio: true,
    //     });

    //     transport.produce({
    //       track: stream.getVideoTracks()[0],
    //     });

    //     this.player.setStream(stream);

    //     stream.getVideoTracks()[0].addEventListener('ended', () => {
    //       transport.close();
    //     });
    //   }
    // );
  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/\S+$/;
    return urlPattern.test(url);
  }
}
