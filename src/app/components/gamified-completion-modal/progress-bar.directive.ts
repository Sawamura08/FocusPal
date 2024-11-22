import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { userGameData } from '../../interfaces/game.interface';

@Directive({
  selector: '[appProgressBar]',
})
export class ProgressBarDirective implements OnInit {
  constructor(protected el: ElementRef, protected renderer: Renderer2) {}

  ngOnInit(): void {
    this.addNewExp(this.appProgressBar);
  }
  @Input() appProgressBar!: userGameData;

  public addNewExp = (appProgressBar: userGameData) => {
    const element = this.el.nativeElement;
    if (appProgressBar && appProgressBar.currentExp != null) {
      const prevExp: number = appProgressBar.currentExp;
      const needExp: number = appProgressBar.nextLevelExp;

      // SET WIDTH PERCENTAGE
      const prevPercentageWidth = this.getPrevPercentageWidth(prevExp, needExp);
      this.renderer.setStyle(element, 'width', `${prevPercentageWidth}%`);
      const latestWidth = this.getNewPercentageWidth(prevExp, needExp);

      const styleElement = this.renderer.createElement('style');

      const keyframes = `
        @keyframes progress {
          0% {
            width: ${prevPercentageWidth}%;
          }
          100% {
            width: ${latestWidth}%;
          }
        }
      `;

      styleElement.textContent = keyframes;
      this.renderer.appendChild(document.head, styleElement);

      this.renderer.setStyle(element, 'animation', `progress 1s ease-in`);

      setTimeout(() => {
        this.renderer.setStyle(element, 'width', `${latestWidth}%`);
      }, 1000);
    }
  };

  public getPrevPercentageWidth = (currentExp: number, needExp: number) => {
    const currentWidth = (currentExp / needExp) * 100;

    return currentWidth;
  };

  public getNewPercentageWidth = (currentExp: number, needExp: number) => {
    const addedEXP = 20;
    const newExp = currentExp + addedEXP;
    const newWidth = (newExp / needExp) * 100;

    return newWidth;
  };
}
