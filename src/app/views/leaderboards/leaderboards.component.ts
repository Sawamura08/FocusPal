import { Component } from '@angular/core';
import { headerType } from '../../components/header/header.component';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.scss',
})
export class LeaderboardsComponent {
  constructor() {}

  public homeHeaderData: headerType = {
    type: 'Leaderboards',
    isHome: true,
  };

  isOtherLeaderShowed: boolean = false;
  public showOtherLeaders = () => {
    this.isOtherLeaderShowed = !this.isOtherLeaderShowed;
  };
}
