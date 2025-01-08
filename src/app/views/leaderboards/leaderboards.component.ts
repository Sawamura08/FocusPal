import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { headerType } from '../../components/header/header.component';
import {
  BackgroundSyncService,
  syncType,
} from '../../service/background-sync.service';
import { userLeaderboard } from '../../interfaces/auth.inferface';
import { LeaderboardsService } from '../../service/leaderboards.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.scss',
})
export class LeaderboardsComponent implements OnInit {
  constructor(
    protected backgroundSync: BackgroundSyncService,
    protected leader: LeaderboardsService
  ) {}

  ngOnInit(): void {
    this.getTopUsers();
  }
  public homeHeaderData: headerType = {
    type: 'Leaderboards',
    isHome: true,
  };
  public destroyRef = inject(DestroyRef);
  public loadingText = { text: 'Fetching Top Users...' };
  public LeaderboardLoading: boolean = true;

  isOtherLeaderShowed: boolean = false;
  public showOtherLeaders = () => {
    this.isOtherLeaderShowed = !this.isOtherLeaderShowed;
  };

  public topUsers: userLeaderboard[] = [];

  /* FETCH ALL PLAYERS */
  public getTopUsers = () => {
    this.leader
      .fetchTopUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.topUsers = value;

        if (this.topUsers.length > 0) {
          setTimeout(() => {
            this.LeaderboardLoading = false;
          }, 1500);
        }
      });
  };

  /* SET THE USER PROFILE */
  public fetchTopUserProfile = (index: number) => {
    if (this.topUsers != undefined) {
      return `Avatars/${this.topUsers[index].profile}`;
    } else {
      return '';
    }
  };

  /* FETCH OTHER USER */
  public fetchOtherTopUser = () => {
    return this.topUsers.slice(3);
  };
}
