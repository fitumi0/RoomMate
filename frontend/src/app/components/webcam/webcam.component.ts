import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
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
import { MediaPlayerElement, MediaProviderElement } from 'vidstack/elements';
import { CommonModule, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
})
export class WebcamComponent implements  AfterViewInit {
  @Input() stream: MediaStream | null = null;
  @Input() id: string | number = '';
  @ViewChild('webcamElement') webcamElement: ElementRef | undefined;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    
  }
  ngAfterViewInit(): void {
    if (this.webcamElement && this.stream) {
      this.webcamElement.nativeElement.src = this.stream;
      this.webcamElement.nativeElement.autoPlay = true;
      this.cdr.detectChanges();
    }
  }

}
