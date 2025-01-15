import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { headerType } from '../../components/header/header.component';
import { User } from '../../database/db';
import { SessionService } from '../../service/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { GameUserDataService } from '../../database/game-user-data.service';
import { userGameData } from '../../interfaces/game.interface';
import { gameTitles, rankInfo } from '../../interfaces/game';
import { EditProfileService } from './components/edit-profile/edit-profile.service';
import { modalStatus } from '../../Objects/modal.details';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    protected session: SessionService,
    protected userInGameInfo: GameUserDataService,
    protected editProfile: EditProfileService
  ) {}

  ngOnInit(): void {
    this.fetchSession();
  }
  public homeHeaderData: headerType = {
    type: 'User Profile',
    isHome: true,
  };

  public destroyRef = inject(DestroyRef);
  public isNotificationOn: boolean = false;
  public notificationText: string = 'Notification turned On';
  public isNotifTextShowed: boolean = false;
  public timeoutId: any;

  public userInfo: User | undefined;
  public inGameData: userGameData | undefined;
  public rankInterface = rankInfo;
  public neededExp!: number;
  public gameTitles = gameTitles;
  public expProgressPercent!: number;

  /* public changeNotificationStatus = () => {
    clearTimeout(this.timeoutId);
    if (!this.isNotifTextShowed) {
      this.isNotifTextShowed = true;
      if (!this.isNotificationOn) {
        this.isNotificationOn = true;
        this.notificationText = 'Notification turned On';
      } else {
        this.isNotificationOn = false;
        this.notificationText = 'Notification turned Off';
      }

      this.timeoutId = setTimeout(() => {
        this.isNotifTextShowed = false;
      }, 2000);
    } else {
      this.isNotifTextShowed = false;
      setTimeout(() => {
        this.changeNotificationStatus();
      }, 100);
    }
  }; */

  /* GET SESSION */
  public fetchSession = () => {
    this.session
      .getUser()
      .pipe(
        filter((value) => value != undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.userInfo = value;
        this.getUserInGameInfo(this.userInfo.userId);
      });
  };

  /* Get user game Info */
  public getUserInGameInfo = async (userId: number) => {
    const result = await this.userInGameInfo.fetchUserByID(userId);

    this.inGameData = result.value;

    /* SET DATE CONFIGURATION */
    this.getNeededExp();
  };

  public setProfileImage = (fileName: number) => {
    return `Avatars/${fileName}.png`;
  };

  public setRankImage = (fileName: number) => {
    return `ranks/${fileName}.png`;
  };

  /* GET CURRENT RANK EXP PROGRESS */
  public getNeededExp = () => {
    const currentExp = this.inGameData?.currentExp;
    const nextLevelExp = this.inGameData?.nextLevelExp;

    if (currentExp != undefined && nextLevelExp) {
      this.neededExp = nextLevelExp - currentExp;

      this.expProgressPercent = (currentExp / nextLevelExp) * 100;
    }
  };

  public getRankProgress = () => {
    return `${this.expProgressPercent}%`;
  };

  /* FOR MODAL */
  /* GET MODAL STATUS */
  public fetchEditProfileModalStatus = () => {
    return this.editProfile.getEditProfileModalStatus();
  };

  public openEditProfileModal = () => {
    this.editProfile.setEditProfileModalStatus(modalStatus.open);
  };
}
