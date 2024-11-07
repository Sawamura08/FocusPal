import {
  state,
  style,
  trigger,
  animate,
  transition,
} from '@angular/animations';

export const slideLeft = trigger('left', [
  state('*', style({ display: 'block' })),

  transition(':enter', [
    style({ opacity: 0.3, transform: 'TranslateX(-100%)' }),
    animate(
      '200ms ease-in',
      style({ opacity: 1, transform: 'TranslateX(0%)' })
    ),
  ]),

  transition(':leave', [
    style({ opacity: 0.3, transform: 'TranslateX(0%)' }),
    animate(
      '200ms ease-in',
      style({ opacity: 1, transform: 'TranslateX(-100%)' })
    ),
  ]),
]);
