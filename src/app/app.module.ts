import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { AppsComponent } from './layouts/apps/apps.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { StarterComponent } from './layouts/starter/starter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule, DatePipe } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './module/shared.module';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  provideNativeDateAdapter,
  MatNativeDateModule,
} from '@angular/material/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { GamifiedCompletionModalComponent } from './components/gamified-completion-modal/gamified-completion-modal.component';
import { ProgressBarDirective } from './components/gamified-completion-modal/progress-bar.directive';
import { RanksPipe } from './pipe/ranks.pipe';
import { ExpToFillPipe } from './pipe/exp-to-fill.pipe';
import { RankUpComponent } from './components/rank-up/rank-up.component';
import { HamburgerInterfaceComponent } from './layouts/hamburger-interface/hamburger-interface.component';

@NgModule({
  declarations: [
    AppsComponent,
    AuthComponent,
    AppComponent,
    StarterComponent,
    AddTaskComponent,
    GamifiedCompletionModalComponent,
    ProgressBarDirective,
    RanksPipe,
    ExpToFillPipe,
    RankUpComponent,
    HamburgerInterfaceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    ServiceWorkerModule.register('service-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    SharedModule,
  ],
  providers: [provideHttpClient(), DatePipe, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
