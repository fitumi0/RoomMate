import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [MatIconModule, IconSizeDirective],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
})
export class FormatsComponent {}
