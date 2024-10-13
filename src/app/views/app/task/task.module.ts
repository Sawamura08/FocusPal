import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TextPipePipe } from '../../../pipe/text-pipe.pipe';

@NgModule({
  declarations: [TaskComponent, TextPipePipe],
  imports: [CommonModule, TaskRoutingModule],
})
export class TaskModule {}
