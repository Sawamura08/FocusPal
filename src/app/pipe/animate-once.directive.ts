import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimateOnce]',
})
export class AnimateOnceDirective implements OnInit {
  @Input() appAnimateOnce!: boolean;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.checkIsAnimated();
  }

  private checkIsAnimated = () => {
    if (!this.appAnimateOnce) {
      this.el.nativeElement.classList.add(
        'animate__animated',
        'animate__bounceIn'
      );

      setTimeout(() => {
        this.el.nativeElement.classList.remove(
          'animate__animated',
          'animate__bounceIn'
        );
      }, 1000);

      this.appAnimateOnce = true;
    }
  };
}
