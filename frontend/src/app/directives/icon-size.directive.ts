import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Directive that sets the icon size dynamically based on the provided input.
 * 
 * Usage example:
 * <div appIconSize="24px">...</div>
 * 
 * @param size The desired size for the icon ('24px', '2rem').
 */
@Directive({
  selector: '[appIconSize]',
  standalone: true,
})
export class IconSizeDirective implements OnInit {
  @Input('appIconSize') size: string = '';

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.element.nativeElement.style.fontSize = this.size;
    this.element.nativeElement.style.width = this.size;
    this.element.nativeElement.style.height = this.size;
  }
}
