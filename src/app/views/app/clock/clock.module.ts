import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClockRoutingModule } from './clock-routing.module';
import { ClockComponent } from './clock.component';
import { SharedModule } from '../../../module/shared.module';

@NgModule({
  declarations: [ClockComponent],
  imports: [CommonModule, ClockRoutingModule, SharedModule],
})
export class ClockModule {}
