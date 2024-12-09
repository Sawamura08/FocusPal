import { Injectable, signal } from '@angular/core';
import { modalStatus } from '../../../../Objects/modal.details';

@Injectable({
  providedIn: 'root',
})
export class HamburgerObservableService {
  constructor() {}

  public hamburgerModalSignal = signal<boolean>(modalStatus.close);

  public setHamburgerModalStatus = (status: boolean) => {
    this.hamburgerModalSignal.set(status);
  };

  public getHamburgetModalStatus = () => {
    return this.hamburgerModalSignal;
  };

  /* MODAL ANIMATION SIGNAL */
  public hamburgerAnimationSignal = signal<boolean>(modalStatus.open);

  public setHamburgerAnimation = (status: boolean) => {
    this.hamburgerAnimationSignal.set(status);
  };

  public getHamburgerAnimation = () => {
    return this.hamburgerAnimationSignal;
  };
}
