import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { AppsComponent } from './layouts/apps/apps.component';
import { StarterComponent } from './layouts/starter/starter.component';
import { HamburgerInterfaceComponent } from './layouts/hamburger-interface/hamburger-interface.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/starter/starter',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./views/auth/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'signup',
        loadChildren: () =>
          import('./views/auth/signup/signup.module').then(
            (m) => m.SignupModule
          ),
      },
    ],
  },
  {
    path: 'apps',
    component: AppsComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./views/app/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./views/app/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./views/app/task/task.module').then((m) => m.TaskModule),
      },
      {
        path: 'clock',
        loadChildren: () =>
          import('./views/app/clock/clock.module').then((m) => m.ClockModule),
      },
    ],
  },
  {
    path: 'starter',
    component: StarterComponent,
    children: [
      {
        path: 'starter',
        loadChildren: () =>
          import('./views/starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./views/welcome/welcome.module').then((m) => m.WelcomeModule),
      },
    ],
  },
  {
    path: 'hamburger-interface',
    component: HamburgerInterfaceComponent,
    children: [
      {
        path: 'leaderboards',
        loadChildren: () =>
          import('./views/leaderboards/leaderboards.module').then(
            (m) => m.LeaderboardsModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./views/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'class-sched',
        loadChildren: () =>
          import('./views/class-sched/class-sched.module').then(
            (m) => m.ClassSchedModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
