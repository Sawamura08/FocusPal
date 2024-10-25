import {
  animate,
  transition,
  style,
  trigger,
  state,
} from '@angular/animations';

export const slideRight = trigger('slide', [
  state('*', style({ opacity: 1 })),
  transition(':enter', [
    style({ opacity: 0, transform: 'TranslateX(100%)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'TranslateX(0)' })),
  ]),

  transition(':leave', [
    animate(
      '400ms ease-out',
      style({ opacity: 0, transform: 'Translatex(-100%)' })
    ),
  ]),
]);
