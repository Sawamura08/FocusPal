import { Injectable } from '@angular/core';
import { db, Schedule } from './db';
import { liveQuery } from 'dexie';
import { switchMap, Observable, distinctUntilChanged, from } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Repition, ScheduleService } from './schedule.service';
import { SessionService } from '../service/session.service';

export enum DAYS_OF_WEEK {
  MONDAY = 1,
  SUNDAY = 0,
}

export interface Days {
  Monday: Schedule[];
  Tuesday: Schedule[];
  Wednesday: Schedule[];
  Thursday: Schedule[];
  Friday: Schedule[];
  Saturday: Schedule[];
  Sunday: Schedule[];
}

@Injectable({
  providedIn: 'root',
})
export class WeeklyScheduleService extends ScheduleService {
  public weeklySched$: Observable<any>;
  constructor(datePipe: DatePipe, session: SessionService) {
    super(datePipe, session);

    this.weeklySched$ = this.userId$.pipe(
      distinctUntilChanged(),
      switchMap((userId) => {
        if (userId === undefined) {
          return from(Promise.resolve([]));
        }

        return from(liveQuery(() => this.getWeeklyTask(userId)));
      })
    );
  }

  public sundayIndex = 7;
  public getWeeklyTask = async (userId: number, date?: Date): Promise<any> => {
    const dayNames: (keyof Days)[] = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let dailySched: Days = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    let dailySchedIndex: number;

    /* GET DATE TODAY */
    const currentDate = date ?? new Date();

    /* GET THE MONDAY date*/
    const mondayDate = this.getMonday(currentDate);

    /* GET SUNDAY DATE */
    const datesUntilSunday = this.getDateUntilSunday(mondayDate);

    /* LOOP THROUGH DATES OF THE WHOLE WEEK */
    for (const date of datesUntilSunday) {
      let dayIndex = new Date(date).getDay();

      /* check if it's sunday */
      if (dayIndex === DAYS_OF_WEEK.SUNDAY) {
        dayIndex = this.sundayIndex;
      }

      /* ALIGN DAY INDEX TO DAYNAMES INDEX */
      dailySchedIndex = dayIndex - 1;
      const currentDay: keyof Days = dayNames[dailySchedIndex];

      /* FETCH DATA */
      const currentDaySchedList: Schedule[] = await this.getDailySched(
        userId,
        date
      );
      dailySched[currentDay] = currentDaySchedList;
    }
    return dailySched;
  };

  private getMonday = (currentDate: Date): Date => {
    const todayTimeStamp = currentDate.getTime();
    let todayDayIndex: number = currentDate.getDay();
    let mondayOffset: number;
    const millisecondsInDay: number = 24 * 60 * 60 * 1000;
    let mondayOffsetMilliseconds: number;
    let mondayDateStamp: number;

    /* IF TODAY IS SUNDAY COVERT IT TO 7 */
    if (todayDayIndex === DAYS_OF_WEEK.SUNDAY) todayDayIndex = this.sundayIndex;

    if (todayDayIndex != DAYS_OF_WEEK.MONDAY) {
      /* GET THE HOW MANY DAYS TO GO BACK TO MONDAY */
      mondayOffset = todayDayIndex - 1;
      mondayOffsetMilliseconds = mondayOffset * millisecondsInDay;
      mondayDateStamp = todayTimeStamp - mondayOffsetMilliseconds;
      const mondayDate: Date = new Date(mondayDateStamp);
      return mondayDate;
    } else {
      return currentDate;
    }
  };

  private getDateUntilSunday = (mondayDate: Date) => {
    const mondayTimeStamp = mondayDate.getTime();
    let dateUntilSundayArr: string[] = [];
    let daysUntilSunday: number = 0;

    for (let i = daysUntilSunday; i < this.sundayIndex; i++) {
      const millisecondsInDay: number = 24 * 60 * 60 * 1000;
      const untilSundayMilliseconds: number =
        daysUntilSunday * millisecondsInDay;
      const sundayMilliseconds: number =
        mondayTimeStamp + untilSundayMilliseconds;
      const currentDate: Date = new Date(sundayMilliseconds);
      dateUntilSundayArr[i] =
        this.datePipe.transform(currentDate, 'yyyy-MM-dd') || '2024-10-10';
      daysUntilSunday++;
    }

    return dateUntilSundayArr;
  };

  /* DAILY DATES */

  public getDailySched = async (userId: number, currentDate: string) => {
    const Repeat = Repition;
    const dateString = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    const dailySched = await super.getAllTaskDefault(userId, currentDate);

    return dailySched;
  };
}
