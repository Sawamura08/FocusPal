import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopModalService } from '../../service/pop-modal.service';
import { SessionService } from '../../service/session.service';
import { catchError, of, Subscription } from 'rxjs';
import { ScheduleService } from '../../database/schedule.service';
import { termsAnimate } from '../terms-conditions/terms-animate';
import { Schedule } from '../../database/db';
import { DatePipe } from '@angular/common';
import { confirmModal, toastModal } from '../../interfaces/export.object';
import { DateTimeService } from '../../service/date-time.service';
import { ToastModalService } from '../../service/toast-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespaceValidator } from '../../views/auth/signup/match-pass-validator';

@Component({
  selector: 'app-add-sched',
  templateUrl: './add-sched.component.html',
  styleUrl: './add-sched.component.scss',
  animations: [termsAnimate],
})
export class AddSchedComponent implements OnInit, OnDestroy {
  userInput: FormGroup;
  public destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    private popModal: PopModalService,
    private session: SessionService,
    private sched: ScheduleService,
    private datePipe: DatePipe,
    private dateTime: DateTimeService,
    private toast: ToastModalService
  ) {
    this.userInput = this.fb.group({
      title: ['', [Validators.required, noWhitespaceValidator()]],
      repeat: ['', Validators.required],
      date: ['', Validators.required],
      daysOfWeek: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  private subscriptionArr: Subscription[] = [];

  ngOnInit(): void {
    // FETCH USER SESSION
    this.getSession();

    //SUBSCRIBE FOR CONFIRMATION UPDATE MODAL
    this.confirmModalSubscribe();

    // SET SCHEDULE DATA IN UPDATE MODE
    this.setExistingData();
  }

  /* FETCH SESSION */
  private userId?: number;
  public getSession = async () => {
    this.session
      .getUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on fetching userInfo', err);
          return of(undefined);
        })
      )
      .subscribe({
        next: (value) => {
          this.userId = value?.userId;
        },
      });
  };

  /* FOR TYPE OF REPEAT = ONE-TIME DAILY CUSTOM */
  public typeRepeat: string[] = ['One-Time', 'Daily', 'Custom'];
  currentType: number = 0;
  public selectTypeRepeat = (type: number) => {
    this.currentType = type;
  };

  /* END */

  /* DAYS OF THE WEEK &&  SELECT DAYS*/
  public daysOfWeek: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  private daysSelected: number[] = [];
  public selectDays = (day: number) => {
    /* REMOVE THE DAY IF IT'S ALREADY INCLUDED */
    if (this.daysSelected.includes(day)) {
      const index: number = this.daysSelected.indexOf(day);
      this.daysSelected.splice(index, 1);
      return;
    }

    this.daysSelected.push(day);
  };

  public isDaySelected = (day: number): string => {
    return this.daysSelected.includes(day) ? 'selected' : '';
  };

  /* END */

  /* CATEGORY */

  public categories: string[] = [
    'Class',
    'Meeting',
    'Family/Friends',
    'Others',
  ];

  public categoryCurrentIndex: number = 0;

  public selectCategory = (value: number) => {
    this.categoryCurrentIndex = value;
  };

  /* END */

  /* CLOSE THE INSERT SCHED MODAL */

  public closeModal = () => {
    this.popModal.addListModal(false);
    this.popModal.isModalOpen(false);
  };

  /* END */

  /* FORM INPUTS */

  get title() {
    return this.userInput.get('title');
  }

  get startTime() {
    return this.userInput.get('startTime');
  }

  get endTime() {
    return this.userInput.get('endTime');
  }

  get location() {
    return this.userInput.get('location');
  }

  /* END */

  /* VALIDATORS */

  public validators = (inputs: any): boolean => {
    if ((inputs?.dirty || inputs?.touched) && inputs?.invalid) {
      return false;
    }

    return true;
  };

  public restrictDates = (date: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (date || today) >= today;
  };

  public restrictStartTime = (): string => {
    if (this.newEndTime && this.newStartTime) {
      return '00:00';
    } else if (!this.newEndTime) {
      return '00:00';
    } else {
      return this.newEndTime;
    }
  };

  public maxRestrictStartTime = (): string => {
    return '11:59 PM';
  };

  public restrictEndTime = (): string => {
    return this.newStartTime || '00:00';
  };

  public maxRestrictEndTime = (): string => {
    return '11:59 PM';
  };

  /* END */

  /* SUBMIT SCHED */

  // SET THE REPEAT SCHEDULE
  private setRepeatedDays = (repeat: number) => {
    if (repeat === 2) {
      if (this.daysSelected.length != 0) {
        this.userInput.get('daysOfWeek')?.setValue(this.daysSelected);
      } else {
        this.currentType = 0;
        this.userInput.get('repeat')?.setValue(this.currentType);
      }
    } else {
      this.daysSelected = [];
      this.userInput?.get('daysOfWeek')?.setValue(this.daysSelected);
    }
  };

  /* SET TIME VALUES TO THE FORM INPUTS */
  newStartTime: string = '';
  newEndTime: string = '';
  public invalidStartTime?: boolean;
  public invalidEndTime?: boolean;

  public setTimeChange = (
    timeType: 'startTime' | 'endTime',
    timeValue: string
  ) => {
    this.userInput.get(timeType)?.setValue(timeValue);

    const setValue = this.userInput.get(timeType)?.value;

    if (timeType === 'startTime') {
      if (setValue != '') {
        this.invalidStartTime = true;
        let newFormat: Date = this.dateTime.transformTimeToDate(setValue);
        this.userInput.get('startTime')?.setValue(newFormat);
        return;
      } else {
        this.invalidStartTime = false;
        return;
      }
    }

    if (timeType === 'endTime') {
      if (setValue != '') {
        this.invalidEndTime = true;
        let newFormat: Date = this.dateTime.transformTimeToDate(setValue);
        this.userInput.get('endTime')?.setValue(newFormat);
        return;
      } else {
        this.invalidEndTime = false;
        return;
      }
    }
  };
  /* END */

  // SET OTHER FORM VALUES BEFORE SUBMIT

  public prepareFormValues = () => {
    this.userInput.get('repeat')?.setValue(this.currentType);
    this.userInput.get('type')?.setValue(this.categoryCurrentIndex);
    const repeat = this.userInput.get('repeat')?.value;
    this.setRepeatedDays(repeat);

    if (repeat != 0) {
      const date = new Date();
      this.userInput.get('date')?.setValue(date);
    }
  };

  // INSERTING NEW VALUES FOR SCHEDULE
  public submit = async () => {
    // check all fields
    this.userInput.markAllAsTouched();

    //set the sched value before attempting to submit
    this.prepareFormValues();

    if (this.userInput.valid) {
      //submit the code

      const schedId = await this.sched.insertSched(
        this.userId!,
        this.userInput.value
      );

      if (schedId != 0) {
        this.closeModal();
      } else {
        console.log('Error!');
      }
    }
  };

  /* END */

  /* ---------------- UPDATING SCHEDULE ---------------------- */

  @Input() updateData: any;
  @Input() isUpdate?: boolean;

  /* SET SCHEDULED DATA */
  public setExistingData = () => {
    if (this.updateData) {
      // get the ID to update specific SCHEDULE
      this.schedId = this.updateData.schedId;
      //SET ALL THE SCHEDULED DATA TO THE FORMS
      this.userInput.patchValue(this.updateData);

      // set DATA TO UI FORMS
      this.setDataToForms();

      /* TRANSFORM THE DATE OBJECT TO TIME */
      this.newStartTime = this.dateTime.transformDateToTime(
        this.updateData?.startTime
      );
      this.newEndTime = this.dateTime.transformDateToTime(
        this.updateData?.endTime
      );
    }
  };

  /* END */

  /* SET DATA TO UI SCHEDULE FORMS */

  public setDataToForms = () => {
    this.categoryCurrentIndex = this.updateData?.type;
    this.currentType = this.updateData?.repeat;
    const selectedDays = this.updateData?.daysOfWeek;
    if (selectedDays) {
      this.daysSelected = selectedDays;
    }
  };

  /* END */

  /* UPDATE DATA */
  schedId: number = 0;
  confirmModal: confirmModal = {
    imgPath: '/extra/warning.png',
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
  };
  confirmationModalMode: boolean = false;
  confirmation: boolean | null = null;
  toastType!: toastModal;

  public udpateSchedule = async () => {
    this.prepareFormValues();
    this.userInput.markAllAsTouched();

    // this await will not go through unless the user has an action
    this.confirmation = await this.openConfirmModal();

    /* SET UP THE TOAST TYPE TO UPDATE */
    this.toastType = {
      type: 'Update',
      status: true,
    };

    if (this.userInput.value && this.confirmation) {
      const result = await this.sched.updateSchedInfo(
        this.schedId,
        this.userInput.value
      );
      this.popModal.isModalOpen(false);

      // if the update is successful this will run
      /* trigger the toast modal for successfull */
      result ? this.toast.switchToastModal(this.toastType) : '';

      this.popModal.setConfirmaModalStatus(false);
    }
  };

  /* OPEN CONFIRMATION MODAL */
  isConfirmModalOpen: boolean = false;
  public openConfirmModal = async (): Promise<boolean> => {
    this.confirmationModalMode = true;
    this.popModal.setConfirmaModalStatus(true);

    // WILL RETURN THE USER ACTION
    return await this.confirmModalAction();
  };
  /* END */

  /* SUBSCRIBE TO CONFIRMATION MODAL */
  private confirmModalSubscription!: Subscription;

  public confirmModalSubscribe = () => {
    this.confirmModalSubscription = this.popModal
      .getConfirmModalStatus()
      .subscribe({
        next: (value) => (this.isConfirmModalOpen = value),
        error: (err) => console.log('Error subscribe confirmation', err),
      });

    this.subscriptionArr.push(this.confirmModalSubscription);
  };
  /* END */

  /* ACCEPT CONFIRMATION MODAL */
  private modalActionSubscription!: Subscription;
  public confirmModalAction = (): Promise<boolean> => {
    // A PROMISE THE WILL DETERMINED IF THE CONFIRMATION IS ACCEPT OR REJECT
    return new Promise((resolve, reject) => {
      this.modalActionSubscription = this.popModal
        .getConfirmationModal()
        .subscribe({
          next: (value) => {
            resolve(value);
            this.modalActionSubscription.unsubscribe();
          },
          error: (err) => reject(err),
        });
    });
  };
  /* END */

  /* ------------- DELETE SCHEDULE ---------------- */

  public deleteSchedule = async () => {
    this.toastType = {
      type: 'Delete',
      status: true,
    };
    this.confirmation = await this.openConfirmModal();

    if (this.confirmation) {
      await this.sched.deleteSched(this.schedId);
      this.popModal.setConfirmaModalStatus(false);
      this.popModal.isModalOpen(false);

      /* TRIGGER THE TOAST MODAL */
      this.toast.switchToastModal(this.toastType);
    }
  };

  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
