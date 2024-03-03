import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  $unsubscribe = new Subject<void>();

  constructor(
    private readonly auth: AuthServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    console.log(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.auth.getUserTest().pipe(takeUntil(this.$unsubscribe)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
