import { style, animate, transition, trigger } from '@angular/animations';

export const termsAnimate = trigger('show', [
  transition(':enter', [
    style({ opacity: 0.3, transform: 'TranslateY(-100%)' }),
    animate('500ms ease-in', style({ opacity: 1, transform: 'TranslateY(0)' })),
  ]),
]);
