import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassSchedComponent } from './class-sched.component';

const routes: Routes = [
  {
    path: '',
    component: ClassSchedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassSchedRoutingModule {}
