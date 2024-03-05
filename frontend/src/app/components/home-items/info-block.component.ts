import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import { Item } from '../../types/Item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-block',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconSizeDirective],
  templateUrl: './info-block.component.html',
  styleUrl: './info-block.component.scss',
})
export class InfoBlockComponent {
  @Input() items!: Item[];
  @Input() block!: string;
  constructor() {}
}
