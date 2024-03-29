import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  isDevMode,
} from '@angular/core';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import { Store } from '@ngrx/store';
import { videoUrlSelector } from '../../reducers/videoUrl';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';
import { MediaPlayerElement, MediaProviderElement } from 'vidstack/elements';
import { EventEmitter } from 'node:stream';
import { SocketService } from '../../services/sockets/socket.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnDestroy, OnChanges {
  constructor(
    private store: Store,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private readonly socketService: SocketService
  ) {
    this.url = 'https://www.youtube.com/watch?v=FGAQkUS9Yxw';
    this.src = this.url;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stream'] && !changes['stream'].firstChange) {
      console.log('From player change: ');
      this.playerElement.nativeElement.src = changes['stream']
        .currentValue as MediaStream;
      if (isPlatformBrowser(this.platformId) && isDevMode()) {
        (window as any)['playerStream'] = this.stream;
      }
      this.playerElement.nativeElement.autoPlay = true;
    }
  }
  @ViewChild('playerElement') playerElement!: ElementRef<MediaPlayerElement>;

  playerProvider!: ElementRef<MediaProviderElement>;
  url: string;
  src!: string | MediaStream;
  @Input() stream: MediaStream | null = null;

  $videoUrlChange = this.store
    .select(videoUrlSelector)
    .pipe(
      tap((url) => {
        this.src = url;
        console.log('From player: ', this.url);
      })
    )
    .subscribe();

  ngOnDestroy(): void {
    this.$videoUrlChange.unsubscribe();
  }
}
