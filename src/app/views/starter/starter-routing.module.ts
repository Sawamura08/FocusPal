import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StarterComponent } from './starter.component';
import { WelcomeComponent } from '../welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: StarterComponent,
  },
  {
    path: '../welcome',
    component: WelcomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StarterRoutingModule {}
