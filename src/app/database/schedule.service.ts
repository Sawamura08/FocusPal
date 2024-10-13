import { Injectable, OnInit } from '@angular/core';
import { db, Schedule } from './db';
import { liveQuery } from 'dexie';
import { BehaviorSubject, Observable, from, of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SessionService } from '../service/session.service';

enum Repition {
  REPEAT_NONE = 0,
  REPEAT_DAILY = 1,
  REPEAT_CUSTOM = 2,
}
@Injectable({
  providedIn: 'root',
})
export class ScheduleService implements OnInit {
  schedList$: Observable<any>;
  private userId$ = new BehaviorSubject<number | undefined>(undefined);
  constructor(private datePipe: DatePipe, private session: SessionService) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
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
  ngOnInit(): void {}

  /* GET SESSION */
  private userId?: number;
  private getSession = async () => {
    this.userId = await this.session.getUser();
    this.userId$.next(this.userId);
  };

  /* end */

  public getSchedList = (): Observable<Schedule[]> => {
    return this.schedList$;
  };

  public insertSched = async (
    id: number,
    schedData: Schedule
  ): Promise<number> => {
    const newSched = {
      userId: id,
      title: schedData.title,
      date: schedData.date,
      startTime: schedData.startTime,
      endTime: schedData.endTime,
      repeat: schedData.repeat,
      type: schedData.type,
      isActive: 1,
      daysOfWeek: schedData.daysOfWeek,
    };

    try {
      const schedId = await db.schedList.add(newSched);
      return schedId;
    } catch (err) {
      console.log('Error Insert sched', err);
      return 0;
    }
  };

  /* UPDATE INFORMATION */

  public updateSchedInfo = async (
    schedId: number,
    data: Schedule
  ): Promise<boolean> => {
    try {
      const success = await db.schedList.update(schedId, data);
      if (success) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('Error Update Sched', err);
      return false;
    }
  };

  /* END */

  /* GET SCHEDULE BY DATE | REPEAT */

  public getAllTaskDefault = async (
    id: number,
    date?: string
  ): Promise<Schedule[]> => {
    /* CHECK WHETHER THE date has value or null */
    const dateSelected: string =
      date ?? this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? '2024-01-01';
    const dayToday = new Date(dateSelected).getDay();
    const Repeat = Repition;

    try {
      const sched = await db.schedList
        .where('userId')
        .equals(id)
        .filter((sched) => {
          // CHECK it has DATE AND IS ONE TIME SCHED ONLY
          if (sched.date && sched.repeat === Repeat.REPEAT_NONE) {
            const schedDate = this.datePipe.transform(sched.date, 'yyyy-MM-dd');
            return schedDate === dateSelected ? true : false;
            // CHECK IF THE SCHED IS ON DAILY BASIS
          } else if (sched.repeat === Repeat.REPEAT_DAILY) {
            return true;
            // CHECK IF THE SCHED IS ON CUSTOM THEN CHECK THEIR DAYS
          } else if (sched.repeat === Repeat.REPEAT_CUSTOM) {
            return this.getSchedByDay(sched.daysOfWeek, dayToday);
          } else {
            return false;
          }
        })
        .toArray();

      // SORT BY TIME ONLY REGARDING OF THE DATE
      sched.sort((a, b) => {
        const converted: number[] = this.getTimeBySched(
          a.startTime,
          b.startTime
        );
        return converted[0] - converted[1];
      });

      return sched;
    } catch (err) {
      console.error('Failed to fetch schedules', err);
      return [];
    }
  };

  /* END OF GET SCHEDULE BY DATE | REPEAT */

  public returnSchedDefault = (date?: string) => {
    this.schedList$ = from(
      liveQuery(() => this.getAllTaskDefault(this.userId!, date))
    );
  };

  /* CONVERT DATE TIME TO TIME ONLY AND CHECK THE DIFFERENCE */

  private getTimeBySched = (firstDate: Date, secondDate: Date) => {
    const firstHour = firstDate.getHours();
    const firstMinutes = firstDate.getMinutes();
    const first: number = firstHour * 60 + firstMinutes;
    const seoncdHour = secondDate.getHours();
    const secondMinutes = secondDate.getMinutes();
    const second: number = seoncdHour * 60 + secondMinutes;

    return [first, second] as [number, number];
  };
  /* END */

  /* GET THE DAY OF THE WEEK IF THE VALUE IS CUSTOM */
  public getSchedByDay = (
    days: number[] | undefined,
    dayToday: number
  ): boolean => {
    if (!days) return false;

    return days.some((day) => day === dayToday);
  };

  /* -----------GET THE SCHED BY WEEK ------------ */

  public getSchedByWeek = () => {
    const dateToday = new Date();
  };

  // public schedByWeek = (): Observable<Schedule[]> =>
  // {

  // }
}
