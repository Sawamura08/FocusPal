import { style, animate, transition, trigger } from '@angular/animations';

export const slideDown = trigger('slide', [
  transition(':enter', [
    style({ opacity: 0.3, transform: 'TranslateY(100%)' }),
    animate('200ms ease-in', style({ opacity: 1, transform: 'TranslateY(0)' })),
  ]),
]);
