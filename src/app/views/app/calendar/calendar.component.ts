import { Component, OnDestroy, OnInit } from '@angular/core';
import { Calendar, CalendarDate } from '../../../class/calendar';
import { SessionService } from '../../../service/session.service';
import { Subscription, Subject, takeUntil, combineLatest } from 'rxjs';
import { Schedule } from '../../../database/db';
import { ScheduleService } from '../../../database/schedule.service';
import { DatePipe } from '@angular/common';
import { PopModalService } from '../../../service/pop-modal.service';
import { ToastrService } from 'ngx-toastr';
import { ToastModalService } from '../../../service/toast-modal.service';
import { toastModal } from '../../../interfaces/export.object';
import { WeeklyScheduleService } from '../../../database/weekly-schedule.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  private calendar: Calendar;
  public week: CalendarDate[] = [];
  public today: Date = new Date();
  private currentStartDate: Date;
  private subscriptionArr: Subscription[] = [];

  constructor(
    private session: SessionService,
    private sched: ScheduleService,
    private datePipe: DatePipe,
    private popModal: PopModalService,
    private toastr: ToastrService,
    private toastNotif: ToastModalService,
    private weeklySched: WeeklyScheduleService
  ) {
    this.calendar = new Calendar(this.today.getFullYear());
    this.currentStartDate = this.today; // Start with the current week
    this.today = this.calendar.getCurrentDate();

    /* subscribe to behavior subject */
    this.subscribeBehavior();
  }

  ngOnInit(): void {
    // UPDATE THE DISPLAYED DATES
    this.updateCurrentWeek(this.currentStartDate);

    /* GET USER SESSION */
    this.getSession();

    this.getSchedByDayRepeat();

    /* subscribe to the toast service  */
    this.toastSubscribe();
  }

  /* UPDATE THE WEEK SHOWS 5 DAYS */
  updateCurrentWeek(date: Date): void {
    this.week = this.calendar.getWeek(date);
  }

  /* GET NEXT DAY */
  nextDay(): void {
    const date = this.week[4];
    const setDate: string = `${date?.month + 1}-${date?.date}-${date?.year}`;
    const newDate = this.calendar.getDate(setDate, 'next');

    this.week.shift();
    this.week.push(newDate);

    this.filterbyDate(this.filterDateIndex!);
  }

  /* GET PREVIOUS DAY */
  previousDay(): void {
    const date = this.week[0];
    const setDate: string = `${date?.month + 1}-${date?.date}-${date?.year}`;
    const newDate = this.calendar.getDate(setDate, 'prev');

    this.week.pop();
    this.week.splice(0, 0, newDate);

    this.filterbyDate(this.filterDateIndex!);
  }

  get currentMonthName(): string {
    const monthIndex = this.week[2]?.month; // Middle date's month
    return monthIndex !== undefined
      ? new Date(this.today.getFullYear(), monthIndex).toLocaleString(
          'default',
          { month: 'long' }
        )
      : '';
  }

  get currentYear(): number {
    return this.week[2]?.year; // Middle date's year
  }

  /* FILTER BY DATE */
  filterDateIndex?: number;
  private destroySubscription$: Subject<boolean> = new Subject<boolean>();
  public filterbyDate = (index: number) => {
    /* SET THE CURRENT INDEX OF THE DATE */
    this.filterDateIndex = index;
    const date = this.week[index];

    const setDate: string = `${date?.year}-${date?.month + 1}-${date?.date}`;

    /* SET NEW VALUE TO THE SUBJECT */
    this.destroySubscription$.next(true);

    /* CALL THE FILTER FOR SCHEDULE */
    this.sched.returnSchedDefault(setDate);

    /* CALL THE SUBSCRIBE FUNCTION AGAIN */
    this.getSchedByDayRepeat();
  };
  /* END */

  /* SEND HEADER DATA */

  headerData: string = 'Calendar';

  /* END OF SEND HEADER DATA */

  /* FILTER BY DAY OR WEEKLY */
  filterIndex: number = 0;
  public getSchedByFilterType = (index: number) => {
    this.filterIndex = index;
    // 0 = TODAY/DAILY
    if (index === 0) {
      // Call the index query for Daily
      this.getSchedByDayRepeat();
    }
  };
  /* END */

  /* GET SESSION OF THE USER */
  userId: number | null = null;
  private getSession = async () => {
    this.userId = await this.session.getUser();
  };

  /* END OF GET SESSION OF THE USER */

  /* GET SCHEDULE BY DATE | REPEAT */

  schedList: Schedule[] = [];
  schedDayRepeatSubs!: Subscription;
  public getSchedByDayRepeat = () => {
    this.schedDayRepeatSubs = this.sched.schedList$
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe({
        next: (value) => (this.schedList = value),
        error: (err) => console.error('Error Subscribe', err),
      });

    /* put the subscription to array subs */
    this.subscriptionArr.push(this.schedDayRepeatSubs);
  };

  /* END OF GET SCHEDULE BY DATE | REPEAT */

  /* INSERT NEW SCHED */

  public addSched = () => {
    this.popModal.addListModal(true);
  };

  /* END OF INSERT NEW SCHED */

  /* SUBSCRIBE TO A BEHAVIOR SUBJECT */

  private behaviorSubscription!: Subscription;
  public modalStatus = {
    isAddSchedModalOpen: false,
    isUpdateSchedModalOpen: false,
  };
  private subscribeBehavior = () => {
    const addSchedModal = this.popModal.addList$();
    const updateSchedModal = this.popModal.updateList$();

    this.behaviorSubscription = combineLatest([
      addSchedModal,
      updateSchedModal,
    ]).subscribe({
      next: ([addValue, updateValue]) => {
        this.modalStatus.isAddSchedModalOpen = addValue;
        this.modalStatus.isUpdateSchedModalOpen = updateValue;
      },
      error: (err) => {
        console.log('Error on Subscribing on the modal', err);
      },
    });
  };

  /* END */

  /* ----------- UDPATE SCHEDULE -------------------- */

  updateData: Schedule | undefined;
  isUpdate: boolean = false;

  openModalUpdate = (data: Schedule) => {
    // set the modal to update mode
    this.isUpdate = true;

    // set the scheduled data for update
    this.updateData = data;

    // open the modal
    this.popModal.isModalOpen(true);
  };

  /* END */

  /* MODAL FOR TOAST NOTIFICATION */

  toastSubscription!: Subscription;
  public toastSubscribe = () => {
    this.toastSubscription = this.toastNotif.getToastModal().subscribe({
      next: (value) => {
        this.triggerToast(value);
      },
      error: (err) => console.log('Error on Toast', err),
    });

    this.subscriptionArr.push(this.toastSubscription);
  };

  private triggerToast = (value: toastModal) => {
    /* RESET NOTIF */
    const toastModalReset: toastModal = {
      type: '',
      status: false,
    };
    if (value.type === 'Update' && value.status) {
      this.toastr.success(
        'Update Successful',
        'The schedule has been updated successfully.',
        { timeOut: 2500 }
      );

      this.toastNotif.switchToastModal(toastModalReset);
    } else if (value.type === 'Delete' && value.status) {
      this.toastr.success(
        'Deletion Successful',
        'The schedule has been deleted successfully.',
        { timeOut: 2500 }
      );
      this.toastNotif.switchToastModal(toastModalReset);
    }
  };

  /* END */

  /* NG ON DESTROY */
  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
  /* END */
}
