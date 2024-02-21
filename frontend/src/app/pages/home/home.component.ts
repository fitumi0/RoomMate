import { Component } from '@angular/core';
import { FeaturesComponent } from '../../components/features/features.component';
import { FormatsComponent } from '../../components/formats/formats.component';
import { RoomsComponent } from '../../components/rooms/rooms.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeaturesComponent, FormatsComponent, RoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
