import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { LoginComponent } from '../auth/login/login.component';
import { AppsComponent } from '../app/apps/apps.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: '../auth/login',
    component: LoginComponent,
  },
  {
    path: '../../apps/apps',
    component: AppsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
