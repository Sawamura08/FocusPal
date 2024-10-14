import { Injectable } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { DatePipe } from '@angular/common';
import { SessionService } from '../service/session.service';
import { db, Schedule } from './db';
import { liveQuery } from 'dexie';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterScheduleService extends ScheduleService {
  override schedList$: Observable<any>;
  constructor(datePipe: DatePipe, session: SessionService) {
    super(datePipe, session);

    this.getSession();

    this.schedList$ = this.userId$.pipe(
      switchMap((userId) => {
        if (userId === undefined) {
          return from(Promise.resolve([])); // or some default value
        }
        return from(liveQuery(() => this.getAllTaskDefault(userId)));
      })
    );
  }

  override async getAllTaskDefault(
    id: number,
    date?: string
  ): Promise<Schedule[]> {
    try {
      const schedules = await super.getAllTaskDefault(id, date);
      // Additional logic can go here
      return schedules; // Return the result
    } catch (error) {
      console.error('Error in FilterScheduleService:', error);
      return []; // Return an empty array in case of an error
    }
  }
}
