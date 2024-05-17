import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProvidersEnum } from './providers.enum';
import { Store } from '@ngrx/store';
import { changeUrl } from '../../reducers/videoUrl';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../services/sockets/socket.service';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, IconSizeDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnChanges, OnInit {
  @Input() parentSharing = false;
  @Input() stream: MediaStream | null = null;

  @Input({ required: true }) roomId!: string;

  @Output() onSetStream = new EventEmitter<string>();

  selectedProvider = ProvidersEnum.YouTube;
  videoUrl = '';
  arrayProvidersWithUrl = [ProvidersEnum.YouTube];
  screenShared = false;

  demoVideos: {
    type: string;
    title: string;
    url: string;
  }[] = [
    {
      type: 'HLS',
      title: 'Tears of Steel',
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    },
    {
      type: '.mp4',
      title: 'Big Buck Bunny',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      type: '.mp4',
      title: 'What Car Can You Get For A Grand',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    },
    {
      type: 'Youtube',
      title: '2020 LG OLED l The Black 4K HDR 60fps',
      url: 'https://www.youtube.com/watch?v=njX2bu-_Vw4',
    },
  ];

  constructor(
    private store: Store,
    private readonly toastr: ToastrService,
    private socketService: SocketService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.socketService.onEvent('contentChanged').subscribe((data) => {
        console.log('[contentChanged]', data);

        this.videoUrl = data.url;
        this.store.dispatch(changeUrl({ url: this.videoUrl }));
        this.cdr.detectChanges();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['parentSharing'] &&
      !changes['parentSharing'].firstChange &&
      changes['parentSharing'].currentValue
    ) {
      this.screenShared = true;
    } else {
      this.screenShared = false;
    }
  }

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
    console.log(this.roomId);

    this.socketService.sendMessage('contentChanged', {
      roomId: this.roomId,
      url: this.videoUrl,
      timestamp: 0,
    });
  }

  startScreenShare() {
    this.onSetStream.emit('data');
  }

  stopScreenShare() {
    console.log('stop screen share before', this.stream);
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream?.getVideoTracks()[0].dispatchEvent(new Event('ended'));
    this.stream?.getAudioTracks()[0].dispatchEvent(new Event('ended'));
    this.stream = null;
    this.screenShared = false;
    this.cdr.markForCheck();
    console.log('stop screen share after ', this.stream);
  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/\S+$/;
    return urlPattern.test(url);
  }
}
