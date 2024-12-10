import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardsRoutingModule } from './leaderboards-routing.module';
import { LeaderboardsComponent } from './leaderboards.component';
import { SharedModule } from '../../module/shared.module';

@NgModule({
  declarations: [LeaderboardsComponent],
  imports: [CommonModule, LeaderboardsRoutingModule, SharedModule],
})
export class LeaderboardsModule {}
