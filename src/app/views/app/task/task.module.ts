import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TextPipePipe } from '../../../pipe/text-pipe.pipe';
import { SharedModule } from '../../../module/shared.module';
import { TaskFilterControlComponent } from './Components/task-filter-control/task-filter-control.component';

@NgModule({
  declarations: [TaskComponent, TextPipePipe, TaskFilterControlComponent],
  imports: [CommonModule, TaskRoutingModule, SharedModule],
})
export class TaskModule {}
