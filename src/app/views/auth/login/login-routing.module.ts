import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AppsComponent } from '../../app/apps/apps.component';

const routes: Routes = [
  {
    path: '',
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
export class LoginRoutingModule {}
