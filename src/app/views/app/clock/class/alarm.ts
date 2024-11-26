import { ElementRef, Renderer2 } from '@angular/core';

export class Alarm {
  constructor(protected el: ElementRef, protected renderer: Renderer2) {}

  public autoPlay = (id: string) => {
    const element = this.el.nativeElement.querySelector(`#${id}`);

    if (element) {
      element
        .play()
        .then(() => {
          setTimeout(() => {
            element.pause();
          }, 5000);
        })
        .catch((err: any) => {
          console.error('Playback failed', err);
        });
      return true;
    } else {
      console.error(`Element with id ${id} not found`);
      return false;
    }
  };

  public stopAlarm = (id: string) => {
    const element = this.el.nativeElement.querySelector(`#${id}`);

    if (element) {
      element.pause();
    } else {
      console.error(`Element with id ${id} not found`);
    }
  };
}
