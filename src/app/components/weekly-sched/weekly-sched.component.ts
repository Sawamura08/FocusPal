import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Days,
  WeeklyScheduleService,
} from '../../database/weekly-schedule.service';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-weekly-sched',
  templateUrl: './weekly-sched.component.html',
  styleUrl: './weekly-sched.component.scss',
})
export class WeeklySchedComponent implements OnInit, OnDestroy {
  constructor(private weeklySched: WeeklyScheduleService) {}

  ngOnInit(): void {
    this.getWeeklySched();

    this.fetchWeeklySched();
  }

  /* GET WEEKLY SCHED */
  public dayNames: (keyof Days)[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  public destroy$ = new Subject<boolean>();
  public destroyRef = inject(DestroyRef);
  public schedList: Days | undefined;
  public getWeeklySched = () => {
    this.weeklySched.weeklySched$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {},
      error: (err) => console.error('Error Subscribe', err),
    });
  };

  public fetchWeeklySched = () => {
    this.weeklySched
      .getWeeklySched()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.schedList = value));
  };

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
