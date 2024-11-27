import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClockRoutingModule } from './clock-routing.module';
import { ClockComponent } from './clock.component';
import { SharedModule } from '../../../module/shared.module';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClockComponent, TaskModalComponent],
  imports: [
    CommonModule,
    ClockRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ClockModule {}
