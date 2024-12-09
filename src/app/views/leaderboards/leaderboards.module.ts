import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardsRoutingModule } from './leaderboards-routing.module';
import { LeaderboardsComponent } from './leaderboards.component';


@NgModule({
  declarations: [
    LeaderboardsComponent
  ],
  imports: [
    CommonModule,
    LeaderboardsRoutingModule
  ]
})
export class LeaderboardsModule { }
