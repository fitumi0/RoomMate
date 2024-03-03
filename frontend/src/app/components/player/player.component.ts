import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy } from '@angular/core';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import { Store } from '@ngrx/store';
import { videoUrlSelector } from '../../reducers/videoUrl';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnDestroy {
  constructor(private store: Store) {}
  url = 'https://www.youtube.com/watch?v=FGAQkUS9Yxw';
  $videoUrlChange = this.store
    .select(videoUrlSelector)
    .pipe(
      tap((url) => {
        this.url = url;
        console.log('From pleyer: ', this.url);
      })
    )
    .subscribe();

  ngOnDestroy(): void {
    this.$videoUrlChange.unsubscribe();
  }
}
