import { Component, OnInit } from '@angular/core';
import {
  Days,
  WeeklyScheduleService,
} from '../../database/weekly-schedule.service';
import { SchedTypePipe } from '../../pipe/sched-type.pipe';
import { Schedule } from '../../database/db';

@Component({
  selector: 'app-weekly-sched',
  templateUrl: './weekly-sched.component.html',
  styleUrl: './weekly-sched.component.scss',
})
export class WeeklySchedComponent implements OnInit {
  constructor(private weeklySched: WeeklyScheduleService) {}

  ngOnInit(): void {
    this.getWeeklySched();
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
  public schedList: Days | null = null;
  private getWeeklySched = () => {
    this.weeklySched.weeklySched$.subscribe({
      next: (value) => (this.schedList = value),
      error: (err) => console.error('Error On Subscribe Weekly Sched', err),
    });
  };
}
