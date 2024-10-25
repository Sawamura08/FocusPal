import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';

export const termsAnimate = trigger('show', [
  state('*', style({ opacity: 1 })),
  transition(':enter', [
    style({ opacity: 0.3, transform: 'TranslateY(-100%)' }),
    animate('400ms ease-in', style({ opacity: 1, transform: 'TranslateY(0)' })),
  ]),
  transition(':leave', [
    animate(
      '400ms ease-out',
      style({ opacity: 0, transform: 'TranslateY(-100%)' })
    ),
  ]),
]);
