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
    } else {
      console.error(`Element with id ${id} not found`);
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

export class AlarmHandler {
  constructor() {}

  private timeoutId: any;
  private isInterrupted: boolean = false;
  public waitWidthInterruption = (delay: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.timeoutId = setTimeout(() => {
        if (!this.isInterrupted) {
          resolve();
        }
      }, delay);
    });
  };

  public interrupt = () => {
    this.isInterrupted = true;
    clearTimeout(this.timeoutId);
  };
}
