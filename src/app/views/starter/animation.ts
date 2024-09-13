import { trigger, style, animate, transition } from '@angular/animations';
import { HostListener } from '@angular/core';

export const animationStart = trigger('grow', [
  transition(':enter', [
    style({ opacity: 0.3, transform: 'scale(0.3)' }),
    animate('1.5s ease-in', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);
