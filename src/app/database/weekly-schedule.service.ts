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

  public getWeeklyTask = async (userId: number, date?: Date): Promise<any> => {
    let weeklySched = [];
    const sundayIndex = 7;

    const dayNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let dailySched = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    /* GET DATE TODAY */
    const currentDate = date ?? new Date();

    /* GET THE MONDAY date*/
    const mondayDate = this.getMonday(currentDate);

    /* GET SUNDAY DATE */
    const datesUntilSunday = this.getDateUntilSunday(mondayDate);

    for (const date of datesUntilSunday) {
      let days: number;
      let daysOfWeek = new Date(date).getDay();
      if (daysOfWeek === DAYS_OF_WEEK.SUNDAY) daysOfWeek = sundayIndex;

      days = daysOfWeek - 1;
      const currentDay = dayNames[days];
      //console.log(days, dailySched[currentDay]);

      // FIX THIS MJ THE LOOP OF THE DAYS
      //const dailySched = await this.getDailySched(userId, date);
      // weeklySched.push(...dailySched);
    }
  };

  private getMonday = (currentDate: Date): Date => {
    const sundayIndex = 7;
    const todayTimeStamp = currentDate.getTime();
    let todayDayIndex: number = currentDate.getDay();
    let mondayOffset: number;
    const millisecondsInDay: number = 24 * 60 * 60 * 1000;
    let mondayOffsetMilliseconds: number;
    let mondayDateStamp: number;

    /* IF TODAY IS SUNDAY COVERT IT TO 7 */
    if (todayDayIndex === DAYS_OF_WEEK.SUNDAY) todayDayIndex = sundayIndex;

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
    const sundayIndex = 7;
    const mondayTimeStamp = mondayDate.getTime();
    let dateUntilSundayArr: string[] = [];
    let daysUntilSunday: number = 0;

    for (let i = daysUntilSunday; i < sundayIndex; i++) {
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
