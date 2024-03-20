import { Component } from '@angular/core';
import { InfoBlockComponent } from '../../../components/home-items/info-block.component';
import { RoomsComponent } from '../../../components/rooms/rooms.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { Item } from '../../../types/Item';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InfoBlockComponent,
    RoomsComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  features: Item[] = [
    {
      icon: 'sync',
      title: 'SYNCHRONIZED PLAY',
      description: 'Watch video with your friends in sync.',
    },
    {
      icon: 'chat',
      title: 'TEXT CHAT',
      description: 'Chat with your friends while watching videos.',
    },
    {
      icon: 'videocam',
      title: 'VIDEO CHAT',
      description: 'See your friends in real time.',
    },
    {
      icon: 'mic',
      title: 'VOICE CHAT',
      description: 'Talk with your friends while watching videos.',
    },
  ];
  formats: Item[] = [
    {
      icon: 'folder',
      title: 'LOCAL FILES',
      description: 'Share files directly from your device.',
    },
    {
      icon: 'desktop_windows',
      title: 'SCREENSHARE',
      description: 'Share your desktop screen or a browser tab.',
    },
    {
      icon: 'link',
      title: 'ANY VIDEO URLS',
      description: 'Share video URLs directly from your device.',
    },
  ];
}
