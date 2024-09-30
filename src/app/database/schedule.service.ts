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
    this.schedList$ = from(liveQuery(() => db.schedList.toArray()));
  }

  public getSchedList = (): Observable<Schedule[]> => {
    return this.schedList$;
  };

  public insertSched = async (id: number) => {
    const dateToday = new Date().toISOString().split('T')[0];
    const newSched: Schedule = {
      userId: id,
      title: 'IAS 2',
      date: new Date(),
      startTime: new Date(dateToday + 'T' + '16:30'),
      endTime: new Date(dateToday + 'T' + '19:30'),
      repeat: 4,
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
    const dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    const sched = await db.schedList
      .filter((sched) => {
        if (sched.date && sched.repeat === 0) {
          return sched.date.toISOString().includes(dateToday!);
        } else if (sched.repeat === 1) {
          return true;
        } else {
          return false;
        }
      })
      .toArray();

    return sched;
  };

  /* END OF GET SCHEDULE BY DATE | REPEAT */
}
