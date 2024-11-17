import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TextPipePipe } from '../../../pipe/text-pipe.pipe';
import { SharedModule } from '../../../module/shared.module';
import { TaskFilterControlComponent } from './Components/task-filter-control/task-filter-control.component';
import { TaskTagPerosnalPipe } from '../../../pipe/task-tag.pipe';
import { TaskTagAcademicPipe } from '../../../pipe/task-tag-academic.pipe';
import { TaskCategoryPipe } from '../../../pipe/task-category.pipe';
import { TaskBackgroundColorDirective } from './directives/task-background-color.directive';
import { TaskViewDetailComponent } from './Components/task-view-detail/task-view-detail.component';

@NgModule({
  declarations: [
    TaskComponent,
    TextPipePipe,
    TaskFilterControlComponent,
    TaskTagPerosnalPipe,
    TaskTagAcademicPipe,
    TaskCategoryPipe,
    TaskBackgroundColorDirective,
    TaskViewDetailComponent,
  ],
  imports: [CommonModule, TaskRoutingModule, SharedModule],
})
export class TaskModule {}
