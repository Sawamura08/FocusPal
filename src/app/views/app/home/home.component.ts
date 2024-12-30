import {
  Component,
  OnInit,
  OnChanges,
  ElementRef,
  Renderer2,
  SimpleChanges,
  OnDestroy,
  inject,
  WritableSignal,
} from '@angular/core';
import { headerType } from '../../../components/header/header.component';
import { greetings } from '../../../JSON/greetings';
import { fetchResponse } from '../../../interfaces/fetch-response';
import { FetchHomeDataService } from '../../../service/fetch-home-data.service';
import { SetProgressBar } from '../../../class/set-progress-bar';
import { FilterTaskService } from '../../../database/filter-task.service';
import { Schedule, Task, User } from '../../../database/db';
import {
  combineLatest,
  Subscription,
  interval,
  catchError,
  of,
  filter,
} from 'rxjs';
import { FilterScheduleService } from '../../../database/filter-schedule.service';
import { WeeklyScheduleService } from '../../../database/weekly-schedule.service';
import { SessionService } from '../../../service/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { GameUserDataService } from '../../../database/game-user-data.service';
import { taskService } from '../../../database/task.service';
import { ResponseService } from '../../../service/reponse.service';
import { taskCompletion } from '../../../interfaces/export.object';
import { HamburgerObservableService } from './service/hamburger-observable.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnChanges, OnDestroy {
  /* class */
  Progress: SetProgressBar;
  /* end */

  /* INITIALIZED */
  public destroyRef = inject(DestroyRef);
  constructor(
    private fetchHomeData: FetchHomeDataService,
    private el: ElementRef,
    private renderer: Renderer2,
    private filterTask: FilterTaskService,
    private filterSched: FilterScheduleService,
    private weeklySched: WeeklyScheduleService,
    protected session: SessionService,
    protected task: taskService,
    protected gameData: GameUserDataService,
    protected response: ResponseService,
    protected hamburger$: HamburgerObservableService
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

    this.getUser();
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
  };
  /* end */

  /* FETCH USERNAME */
  public username: string | undefined = undefined;
  public userInfo!: User;
  public userId: number | undefined;
  public getUser = () => {
    this.session
      .getUser()
      .pipe(
        filter((value) => value !== undefined),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on fetching userInfo', err);
          return of(undefined);
        })
      )
      .subscribe({
        next: (value) => {
          this.username = value?.userName;
          this.userId = value?.userId;
          /* FETCH COMPLETED TASK */
          this.fetchCompletedTask();
          this.fetchUserGameData();
        },
      });
  };

  /* END */

  /* TASK SUMMARY PROGRESS */
  public completedTask: number | undefined;
  public pendingTask: number | undefined;
  public totalTask: number | undefined;
  public userExp: number | undefined;
  /* RANKINGS */
  public userBadge: number | undefined;

  public fetchCompletedTask = async () => {
    const result = await this.task.fetchAllTaskByID(this.userId!);

    if (result.success && result.value.length != undefined) {
      const allTask = result.value;

      const completedTask = allTask.filter((task: Task) => {
        return task.status === taskCompletion.COMPLETE;
      });

      this.completedTask = completedTask.length;
      this.totalTask = allTask.length;

      /* THERE IS A DELAY ON SESSION DATA THAT'S WHY I RUN IT AGAIN */
      this.setProgressBarStyle();
      this.setPendingBatStyle();
    }
  };

  public fetchUserGameData = async () => {
    const result = await this.gameData.fetchUserByID(this.userId!);

    if (result.success && result.value != null) {
      this.userBadge = result.value.rank;
      this.userExp = result.value.currentExp;
    }
  };

  /* FOR COMPLETED TASK */
  private setProgressBarStyle = () => {
    const gradient = this.Progress.progressBar(
      this.totalTask!,
      this.completedTask!
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
      this.totalTask!,
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

  public setUserBadge = (badge: number) => {
    return `ranks/${badge}.png`;
  };
  /* end */

  /* GET PENDING TASK */

  public pendingTaskList: Task[] | null = null;
  private taskListSubscribe!: Subscription;
  public getPendingTask = () => {
    this.taskListSubscribe = this.filterTask.allTaskByStatus$.subscribe({
      next: (value) => {
        this.pendingTaskList = value;
        this.pendingTask = value.length;
      },
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

  /* MODAL FOR HAMBURGER */

  public fetchHamburgerModalStatus = () => {
    return this.hamburger$.getHamburgetModalStatus()();
  };

  /* END */

  /* ON DESTROY */
  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
