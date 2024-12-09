import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClockRoutingModule } from './clock-routing.module';
import { ClockComponent } from './clock.component';
import { SharedModule } from '../../../module/shared.module';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PomoSettingsComponent } from './components/pomo-settings/pomo-settings.component';
import { ConvertToMin } from './pipe/convet-to-min.pipe';
import { MusicSettingsComponent } from './components/music-settings/music-settings.component';

@NgModule({
  declarations: [
    ClockComponent,
    TaskModalComponent,
    PomoSettingsComponent,
    ConvertToMin,
    MusicSettingsComponent,
  ],
  imports: [
    CommonModule,
    ClockRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ClockModule {}
