import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';

import { SharedModule } from '../../../module/shared.module';
import { TaskFilterControlComponent } from './Components/task-filter-control/task-filter-control.component';
import { TaskBackgroundColorDirective } from './directives/task-background-color.directive';
import { TaskViewDetailComponent } from './Components/task-view-detail/task-view-detail.component';

@NgModule({
  declarations: [
    TaskComponent,
    TaskFilterControlComponent,
    TaskBackgroundColorDirective,
    TaskViewDetailComponent,
  ],
  imports: [CommonModule, TaskRoutingModule, SharedModule],
})
export class TaskModule {}
