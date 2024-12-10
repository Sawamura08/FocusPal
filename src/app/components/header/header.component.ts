import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { HamburgerObservableService } from '../../views/app/home/service/hamburger-observable.service';
import { modalStatus } from '../../Objects/modal.details';

export interface headerType {
  type: string;
  isHome: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private popModal: PopModalService,
    protected hamburger$: HamburgerObservableService
  ) {}
  @Input() data: any;
  @Input() homeData: headerType | null = null;

  headerText: string | undefined = '';
  public home: any;
  ngOnInit(): void {
    /* CHECK WHAT HEADER TO DISPLAY */
    this.checkHeaderType();

    /* RUN ANIMATION FOR LOGO */
    this.setAnimationLogo();
  }

  private checkHeaderType = () => {
    this.headerText = this.data;

    if (!this.headerText) {
      this.home = this.homeData?.isHome;
      this.headerText = this.homeData?.type;
    }
  };

  /* hamburger MENU */
  public spanArr: string[] = ['1', '2', '3'];
  public toggle: boolean = false;
  public toggleMenu = () => {
    this.toggle = !this.toggle;

    if (this.toggle) {
      this.hamburger$.setHamburgerModalStatus(modalStatus.open);
    } else {
      this.hamburger$.setHamburgerAnimation(modalStatus.close);

      setTimeout(() => {
        this.hamburger$.setHamburgerAnimation(modalStatus.open);
        this.hamburger$.setHamburgerModalStatus(modalStatus.close);
      }, 200);
    }
  };

  /* OPEN CHAT AI */

  public openChatAi = (): void => {
    this.popModal.toggleChatModal(true);
  };

  /* END */

  /* SET ANIMATION EVERY 6s FOR LOGO HOME*/
  private ANIMATION_DURATION: number = 4000;
  public animationClass: string = '';
  private intervalId: any;
  public setAnimationLogo(): void {
    this.intervalId = setInterval(() => {
      this.animationClass = this.animationClass ? '' : 'animated';
    }, this.ANIMATION_DURATION);
  }

  /* MODAL FOR HAMBURGER */

  public fetchHamburgerModalStatus = () => {
    return this.hamburger$.getHamburgetModalStatus()();
  };

  /* END */

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
