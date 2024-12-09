import { ElementRef, Renderer2 } from '@angular/core';

export class Music {
  constructor(protected el: ElementRef, protected renderer: Renderer2) {}

  public autoPlay = () => {
    const element = this.el.nativeElement.querySelector('#music');

    if (element) {
      element.load();
      element.play();
    } else {
      console.error(`Element with id music not found`);
    }
  };

  public stopMusic = () => {
    const element = this.el.nativeElement.querySelector('#music');

    if (element) {
      element.pause();
    } else {
      console.error(`Element with id music not found`);
    }
  };
}
