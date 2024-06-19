import {
    AfterViewInit,
    CUSTOM_ELEMENTS_SCHEMA,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
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
import { CaptionButton, MediaControls, mediaContext } from 'vidstack';

@Component({
    selector: 'app-player',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnDestroy, OnChanges, AfterViewInit {
    @Input() stream: MediaStream | null = null;
    @ViewChild('playerElement') playerElement!: ElementRef<MediaPlayerElement>;

    $videoUrlChange = this.store
        .select(videoUrlSelector)
        .pipe(
            tap((url) => {
                this.src = url;
            })
        )
        .subscribe();

    @ViewChild('playerProvider')
    playerProvider!: ElementRef<MediaProviderElement>;
    url: string;
    src!: string | MediaStream | MediaSource | null;

    constructor(
        private store: Store,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        this.url = '';
        this.src = '';
    }
    ngAfterViewInit(): void {
        this.playerElement.nativeElement.viewType = 'video';
        if (isPlatformBrowser(this.platformId)) {
            (window as any)['playerStream'] = this.stream;
            (window as any)['playerElement'] = this.playerElement;
            (window as any)['playerProvider'] = this.playerProvider;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['stream'] && !changes['stream'].firstChange) {
            this.playerElement.nativeElement.src =
                changes['stream'].currentValue;
            if (isPlatformBrowser(this.platformId) && isDevMode()) {
                (window as any)['playerStream'] = this.stream;
                (window as any)['playerElement'] = this.playerElement;
                (window as any)['playerProvider'] = this.playerProvider;
            }
            this.playerElement.nativeElement.autoPlay = false;
        }
    }

    ngOnDestroy(): void {
        this.$videoUrlChange.unsubscribe();
    }
}
