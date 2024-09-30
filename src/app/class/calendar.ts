export interface CalendarDate {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  dayOfWeek?: string; // Optional property for day of the week
}

export class Calendar {
  private currentDate: Date;

  constructor(year: number) {
    this.currentDate = new Date();
  }

  public getWeek(date: Date): CalendarDate[] {
    const startOfWeek = new Date(date);
    // Center around the current day
    const dayOffset = startOfWeek.getDate();
    startOfWeek.setDate(dayOffset - 2);

    const week: CalendarDate[] = [];
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push({
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === date.getMonth(),
        dayOfWeek: currentDate.toLocaleString('default', { weekday: 'short' }), // Get the day of the week
      });
    }
    return week;
  }

  public getDate = (date: string, type: string): CalendarDate => {
    const newDate = new Date(date);
    const startDate =
      type === 'next' ? newDate.getDate() + 1 : newDate.getDate() - 1;
    newDate.setDate(startDate);

    const latest: CalendarDate = {
      date: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
      isCurrentMonth: this.currentDate.getMonth() === newDate.getMonth(),
      dayOfWeek: newDate.toLocaleDateString('default', { weekday: 'short' }),
    };
    return latest;
  };

  public getCurrentDate(): Date {
    return this.currentDate;
  }
}
