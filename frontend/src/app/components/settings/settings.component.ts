import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnChanges } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ProvidersEnum } from './providers.enum';
import { Store } from '@ngrx/store';
import { changeUrl } from '../../reducers/videoUrl';
import { ToastrService, provideToastr } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  selectedProvider = ProvidersEnum.YouTube;
  videoUrl = '';
  arrayProvidersWithUrl = [ProvidersEnum.YouTube];

  constructor(private store: Store, private readonly toastr: ToastrService) {}

  clickPlay() {
    if (this.arrayProvidersWithUrl.includes(this.selectedProvider)) {
      if (!this.videoUrl) {
        this.toastr.error('You must enter a URL', 'Error');
      } else {
        if (!this.isValidUrl(this.videoUrl)) {
          this.toastr.error('Please enter a valid URL', 'Error');
          this.videoUrl = '';
        }
      }

      console.log('URL from settings: ', this.videoUrl);
      this.store.dispatch(changeUrl({ url: this.videoUrl }));
    }
  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/\S+$/;
    return urlPattern.test(url);
  }
}
