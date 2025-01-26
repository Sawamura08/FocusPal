import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassSchedRoutingModule } from './class-sched-routing.module';
import { SchedViewerComponent } from './components/sched-viewer/sched-viewer.component';

@NgModule({
  declarations: [SchedViewerComponent],
  imports: [CommonModule, ClassSchedRoutingModule],
  exports: [SchedViewerComponent],
})
export class ClassSchedModule {}
