import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';

export const slideUp = trigger('slide', [
  state('*', style({ display: 'flex' })),
  transition(':enter', [
    style({ opacity: 0, transform: 'TranslateY(100%)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'TranslateY(0)' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'TranslateY(0)' }),
    animate(
      '300ms ease-in',
      style({ opacity: 0, transform: 'TranslateY(100%)' })
    ),
  ]),
]);
