import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import { MediaPlayerElement, MediaProviderElement } from 'vidstack/elements';
@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
})
export class WebcamComponent implements OnChanges {
  @Input() src!: MediaStream;
  @Input() id: string | number = '';
  @ViewChild('webcam') webcam!: ElementRef<MediaPlayerElement>;

  constructor() {
    (window as any)['webcam'] = this.webcam;
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.webcam);
  }
}
