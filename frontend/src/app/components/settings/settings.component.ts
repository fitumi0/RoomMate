import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProvidersEnum } from './providers.enum';
import { Store } from '@ngrx/store';
import { changeUrl } from '../../reducers/videoUrl';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../services/sockets/socket.service';
import * as mediasoupClient from 'mediasoup-client';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, IconSizeDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnChanges {
  @Input() parentSharing = false;
  @Input() stream: MediaStream | null = null;

  selectedProvider = ProvidersEnum.YouTube;
  videoUrl = '';
  arrayProvidersWithUrl = [ProvidersEnum.YouTube];
  @Output() onSetStream = new EventEmitter<string>();
  screenShared = false;

  constructor(
    private store: Store,
    private readonly toastr: ToastrService,
    private socketService: SocketService,
    private readonly cdr: ChangeDetectorRef
  ) {}
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
