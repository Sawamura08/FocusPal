import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  hamburgerLinks,
  linkIcons,
  navigateLinks,
} from '../../class/hamburger';
import { slideDown } from '../../../../../components/modal/slide-down';
import { HamburgerObservableService } from '../../service/hamburger-observable.service';
import { SessionService } from '../../../../../service/session.service';
import { catchError, filter, firstValueFrom, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameUserDataService } from '../../../../../database/game-user-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { modalStatus } from '../../../../../Objects/modal.details';

@Component({
  selector: 'app-hamburger-nav',
  templateUrl: './hamburger-nav.component.html',
  styleUrl: './hamburger-nav.component.scss',
  animations: [slideDown],
})
export class HamburgerNavComponent implements OnInit {
  constructor(
    protected hamburger$: HamburgerObservableService,
    protected session: SessionService,
    protected gameData: GameUserDataService,
    protected route: Router,
    protected actRoute: ActivatedRoute,
    protected location: Location
  ) {}

  ngOnInit(): void {
    this.fetchSession();

    /* GET THE CURRENT LINK OF THE WEBPAGE */
    this.getCurrentPath();
  }

  public destoryRef = inject(DestroyRef);
  public links = hamburgerLinks;
  public linkIcons = linkIcons;

  /* SET THE LINK ICONS */
  public setUpIcons = (index: number): string => {
    return linkIcons[index];
  };

  public getHamburgerAnimationStatus = () => {
    return this.hamburger$.getHamburgerAnimation()();
  };

  public userName: string = '';
  public userId: number | undefined;
  public fetchSession = () => {
    this.session
      .getUser()
      .pipe(
        filter((value) => value != undefined),
        catchError((err) => {
          console.error(err);
          return of(undefined);
        }),
        takeUntilDestroyed(this.destoryRef)
      )
      .subscribe((value) => {
        this.userName = value?.userName!;
        this.userId = value?.userId;
        this.getGameUserData(this.userId!);
      });
  };

  /* FETCH MAINLY PROFILE PIC */
  public avatar: number | undefined;
  public getGameUserData = async (userId: number) => {
    if (userId != undefined) {
      const result = await this.gameData.fetchUserByID(userId);
      this.avatar = result.value.avatarID;
    }
  };

  public setAvatar = () => {
    return `Avatars/${this.avatar}.png`;
  };

  public navLinks = navigateLinks;
  public currentPath: string = '';

  public navigateLinks = (link: number) => {
    const routeModule = this.navLinks[link];
    let routingLink;

    /* CHECK WHERE PATH TO GO */
    /* HOME AND HAMBURGER HAD DIFFERENT PATH */
    if (this.currentPath === 'home') {
      routingLink = `../../hamburger-interface/${routeModule}`;
    } else {
      if (routeModule === 'home') {
        routingLink = '../../apps/home';
      } else {
        routingLink = `/hamburger-interface/${routeModule}`;
      }
    }

    this.route.navigate([routingLink], { relativeTo: this.actRoute });

    /* CLOSE HAMBURGER MODAL */
    this.hamburger$.setHamburgerModalStatus(modalStatus.close);
  };

  /* THIS WILL DETERMINE WHICH ROUTING LINK TO USE */
  public getCurrentPath = () => {
    const link = this.location.path();
    const webpageName = link.split('/');
    this.currentPath = webpageName[webpageName.length - 1];
  };
}
