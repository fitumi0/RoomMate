import { Directive, ElementRef, Input, OnInit } from '@angular/core';

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
