import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { DatePipe } from '@angular/common';
import { SessionService } from '../service/session.service';
import { db, Schedule } from './db';
import { liveQuery } from 'dexie';
import {
  BehaviorSubject,
  Observable,
  from,
  of,
  switchMap,
  distinctUntilChanged,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterScheduleService extends ScheduleService {
  override schedList$: Observable<any>;
  public meetingList$: Observable<any>;
  constructor(datePipe: DatePipe, session: SessionService) {
    super(datePipe, session);

    this.getSession();

    this.schedList$ = this.userId$.pipe(
      distinctUntilChanged(),
      switchMap((userId) => {
        if (userId === undefined) {
          return from(Promise.resolve([])); // or some default value
        }

        return from(liveQuery(() => this.getAllTaskDefault(userId)));
      })
    );

    this.meetingList$ = this.userId$.pipe(
      distinctUntilChanged(),
      switchMap((userId) => {
        if (userId === undefined) {
          return from(Promise.resolve([])); // or some default value
        }

        return from(liveQuery(() => this.getAllMeeting(userId)));
      })
    );
  }

  override async getAllTaskDefault(
    id: number,
    date?: string
  ): Promise<Schedule[]> {
    try {
      let schedules = await super.getAllTaskDefault(id, date);

      schedules = schedules.filter((sched) => {
        return sched.type === 0 ? true : false;
      });
      return schedules;
    } catch (error) {
      console.error('Error in FilterScheduleService:', error);
      // Return an empty array in case of an error
      return [];
    }
  }

  protected async getAllMeeting(
    id: number,
    date?: string
  ): Promise<Schedule[]> {
    try {
      let schedules = await super.getAllTaskDefault(id, date);
      // Additional logic can go here

      schedules = schedules.filter((sched) => {
        return sched.type === 1 ? true : false;
      });
      return schedules;
    } catch (error) {
      console.error('Error in FilterScheduleService:', error);
      // Return an empty array in case of an error
      return [];
    }
  }
}
