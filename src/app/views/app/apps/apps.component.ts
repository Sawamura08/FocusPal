import {
  Component,
  OnInit,
  OnChanges,
  ElementRef,
  Renderer2,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { headerType } from '../../../components/header/header.component';
import { greetings } from '../../../JSON/greetings';
import { fetchResponse } from '../../../interfaces/fetch-response';
import { FetchHomeDataService } from '../../../service/fetch-home-data.service';
import { SetProgressBar } from '../../../class/set-progress-bar';
import { FilterTaskService } from '../../../database/filter-task.service';
import { Schedule, Task } from '../../../database/db';
import { combineLatest, Subscription } from 'rxjs';
import { FilterScheduleService } from '../../../database/filter-schedule.service';
import { WeeklyScheduleService } from '../../../database/weekly-schedule.service';
import { SessionService } from '../../../service/session.service';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent implements OnInit, OnChanges, OnDestroy {
  /* class */
  Progress: SetProgressBar;
  /* end */
  constructor(
    private fetchHomeData: FetchHomeDataService,
    private el: ElementRef,
    private renderer: Renderer2,
    private filterTask: FilterTaskService,
    private filterSched: FilterScheduleService,
    private weeklySched: WeeklyScheduleService,
    protected session: SessionService
  ) {
    this.Progress = new SetProgressBar();
  }

  ngOnInit(): void {
    this.getGreeting();

    /* FOR SETTING PROGRESS BAR STYLE */
    this.setProgressBarStyle();
    this.setPendingBatStyle();

    /* FETCH PENDING TASK */
    this.getPendingTask();

    /* FETCH CLASS SCHED TODAY */
    this.getSchedToday();
  }

  ngOnChanges(changes: SimpleChanges): void {
    /* FOR SETTING PROGRESS BAR STYLE */
    this.setProgressBarStyle();
    this.setPendingBatStyle();
  }

  /* SUBSCRIPTION ARRAY */
  private subscriptionArr: Subscription[] | null = null;

  /* SEND HEADER DATA */

  public headerData: headerType = {
    type: 'Home',
    isHome: true,
  };

  /* END OF SEND HEADER DATA */

  /* set Greetings */
  public greetingsArr: string[] = greetings;
  public greeting: string | null = null;
  public getGreeting = (): void => {
    const index = Math.floor(Math.random() * greetings.length);
    this.greeting = this.greetingsArr[index];
    this.getUser();
  };
  /* end */

  /* FETCH USERNAME */
  public username: string | null = null;
  public getUser = async () => {
    this.session.fetchUserData().subscribe({
      next: (value) => (this.username = value.userName),
      error: (err) => console.error(err),
    });
  };

  /* END */

  /* TASK SUMMARY PROGRESS */
  public completedTask: number = 3;
  public pendingTask: number = 7;
  public totalTask: number = 10;

  /* FOR COMPLETED TASK */
  private setProgressBarStyle = () => {
    const gradient = this.Progress.progressBar(
      this.totalTask,
      this.completedTask
    );

    // Set the style using Renderer2
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.completed-task'),
      'background',
      gradient
    );
  };

  /* FOR PENDING TASK */
  private setPendingBatStyle = () => {
    const gradient = this.Progress.progressBar(
      this.totalTask,
      null,
      this.pendingTask
    );

    // Set the style using Renderer2
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.task-pending'),
      'background',
      gradient
    );
  };
  /* END */

  /* RANKINGS */
  public userRank = 1;
  public userBadge = 0;

  public setUserBadge = (badge: number) => {
    return `ranks/${badge}.png`;
  };
  /* end */

  /* GET PENDING TASK */

  public pendingTaskList: Task[] | null = null;
  private taskListSubscribe!: Subscription;
  public getPendingTask = () => {
    this.taskListSubscribe = this.filterTask.allTaskByStatus$.subscribe({
      next: (value) => (this.pendingTaskList = value),
      error: (err) => console.log('Error Subscribe on TaskList', err),
    });

    this.subscriptionArr?.push(this.taskListSubscribe);
  };

  /* END */

  /* CLASS FOR TODAY */
  public classToday: Schedule[] | null = null;
  public meetingToday: Schedule[] | null = null;
  private schedSubscription!: Subscription;
  public getSchedToday = () => {
    const classSched = this.filterSched.schedList$;
    const meetingSched = this.filterSched.meetingList$;

    this.schedSubscription = combineLatest([
      classSched,
      meetingSched,
    ]).subscribe({
      next: ([classToday, meetingToday]) => {
        this.classToday = classToday;
        this.meetingToday = meetingToday;
      },
      error: (err) => console.log(err),
    });

    this.subscriptionArr?.push(this.schedSubscription);
  };

  /* END */

  /* ON DESTROY */
  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
