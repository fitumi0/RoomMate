import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [MatIconModule, IconSizeDirective],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}
