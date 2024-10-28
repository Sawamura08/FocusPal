import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimateOnce]',
})
export class AnimateOnceDirective {
  @Input() isChatAnimated!: boolean;
  constructor() {}

  private checkIsAnimated = () => {
    if (!this.isChatAnimated) {
    }
  };
}
