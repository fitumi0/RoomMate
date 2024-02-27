import { Component } from '@angular/core';
import { FeaturesComponent } from '../../components/features/features.component';
import { FormatsComponent } from '../../components/formats/formats.component';
import { RoomsComponent } from '../../components/rooms/rooms.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeaturesComponent,
    FormatsComponent,
    RoomsComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
