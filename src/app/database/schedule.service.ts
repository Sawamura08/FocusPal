import { Injectable } from '@angular/core';
import { db, Schedule } from './db';
import { liveQuery } from 'dexie';
import { Observable, from } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  schedList$: Observable<Schedule[]>;
  constructor(private datePipe: DatePipe) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.schedList$ = from(liveQuery(() => this.getAllTaskDefault()));
    const dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(dateToday);
  }

  public getSchedList = (): Observable<Schedule[]> => {
    return this.schedList$;
  };

  public insertSched = async (id: number) => {
    const dateToday = new Date().toISOString().split('T')[0];
    const newSched: Schedule = {
      userId: id,
      title: 'Break Time',
      date: new Date(),
      startTime: new Date(dateToday + 'T' + '16:00'),
      endTime: new Date(dateToday + 'T' + '16:30'),
      repeat: 0,
      type: 0,
      isActive: 1,
    };

    try {
      const schedId = await db.schedList.add(newSched);
    } catch (err) {
      console.log('Error Insert sched', err);
    }
  };

  /* GET SCHEDULE BY DATE | REPEAT */

  public getAllTaskDefault = async (): Promise<Schedule[]> => {
    // CHECK THE DATE TODAY ON A 'YYYY-MM-DD' FORMAT
    const dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    const sched = await db.schedList
      .filter((sched) => {
        // CHECK it has DATE AND IS ONE TIME SCHED ONLY
        if (sched.date && sched.repeat === 0) {
          const schedDate = this.datePipe.transform(sched.date, 'yyyy-MM-dd');
          return schedDate === dateToday ? true : false;
          // CHECK IF THE SCHED IS ON DAILY BASIS
        } else if (sched.repeat === 1) {
          return true;
        } else {
          return false;
        }
      })
      .toArray();

    sched.sort((a, b) => {
      const converted: number[] = this.getTimeBySched(a.startTime, b.startTime);
      return converted[0] - converted[1];
    });

    return sched;
  };

  /* END OF GET SCHEDULE BY DATE | REPEAT */

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
}
