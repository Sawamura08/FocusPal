import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor(private datePipe: DatePipe) {}

  /* TRANSFORM DATA OBJECT TO 12HR FORMAT */

  public transformDateToTime = (date: Date): string => {
    const time = this.datePipe.transform(date, 'h:mm a') || '6:00 AM';

    return time;
  };

  // CONVERT START AND END TIME TO 24HOUR FORMAT

  public transformTimeToDate = (timeValue: string) => {
    const dateToday = new Date().toLocaleDateString('en-CA');
    let hours24Format: string;
    const start = timeValue.split(' ');
    const time = start[0];
    const amPm = start[1];

    // split hour and minutes
    const timeSplit = time.split(':');

    const hour = timeSplit[0];

    const intHour = parseInt(hour);
    const minutes = timeSplit[1];

    const paddedHour = intHour.toString().padStart(2, '0');
    if (hour === '12' && amPm === 'AM') {
      hours24Format = `00:${minutes}`; // midnight case
    } else if (amPm === 'PM' && intHour < 12) {
      const hours = (intHour + 12).toString();
      hours24Format = `${hours}:${minutes}`; // convert PM time to 24hr format
    } else {
      hours24Format = `${paddedHour}:${minutes}`; // Ensure padding for AM/single-digit hours
    }
    return new Date(dateToday + 'T' + hours24Format);
  };
}
