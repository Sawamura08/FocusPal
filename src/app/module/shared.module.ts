import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../components/loading/loading.component';
import { ModalComponent } from '../components/modal/modal.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { HeaderComponent } from '../components/header/header.component';
import { SchedTypePipe } from '../pipe/sched-type.pipe';
import { AddSchedComponent } from '../components/add-sched/add-sched.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  provideNativeDateAdapter,
  MatNativeDateModule,
} from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ToastrModule } from 'ngx-toastr';
import { WeeklySchedComponent } from '../components/weekly-sched/weekly-sched.component';
import { ChatComponent } from '../components/chat/chat.component';
import { AnimateOnceDirective } from '../pipe/animate-once.directive';
import { FilterTaskModalComponent } from '../components/filter-task-modal/filter-task-modal.component';
import { TaskTagAcademicPipe } from '../pipe/task-tag-academic.pipe';

import { TextPipePipe } from '../pipe/text-pipe.pipe';
import { TaskTagPerosnalPipe } from '../pipe/task-tag.pipe';
import { TaskCategoryPipe } from '../pipe/task-category.pipe';
import { HamburgerNavComponent } from '../views/app/home/components/hamburger-nav/hamburger-nav.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ModalComponent,
    TermsConditionsComponent,
    HeaderComponent,
    SchedTypePipe,
    AddSchedComponent,
    WeeklySchedComponent,
    AnimateOnceDirective,
    ChatComponent,
    FilterTaskModalComponent,
    TextPipePipe,
    TaskTagAcademicPipe,
    TaskTagPerosnalPipe,
    TaskCategoryPipe,
    HamburgerNavComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
  exports: [
    LoadingComponent,
    ModalComponent,
    TermsConditionsComponent,
    HeaderComponent,
    SchedTypePipe,
    AddSchedComponent,
    WeeklySchedComponent,
    AnimateOnceDirective,
    ChatComponent,
    FilterTaskModalComponent,
    TextPipePipe,
    TaskTagAcademicPipe,
    TaskTagPerosnalPipe,
    TaskCategoryPipe,
    HamburgerNavComponent,
  ],
})
export class SharedModule {}
