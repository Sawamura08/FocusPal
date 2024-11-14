import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';

export const slideDown = trigger('slide', [
  state('*', style({ display: 'flex' })),
  transition(':enter', [
    style({ opacity: 0.3, transform: 'TranslateY(100%)' }),
    animate('200ms ease-in', style({ opacity: 1, transform: 'TranslateY(0)' })),
  ]),

  transition(':leave', [
    style({ opacity: 1, transform: 'TranslateY(0)' }),
    animate(
      '200ms ease-in',
      style({ opacity: 0.3, transform: 'TranslateY(100%)' })
    ),
  ]),
]);
