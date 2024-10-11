import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopModalService } from '../../service/pop-modal.service';
import { SessionService } from '../../service/session.service';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../database/schedule.service';
import { termsAnimate } from '../terms-conditions/terms-animate';
import { Schedule } from '../../database/db';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-sched',
  templateUrl: './add-sched.component.html',
  styleUrl: './add-sched.component.scss',
  animations: [termsAnimate],
})
export class AddSchedComponent implements OnInit {
  userInput: FormGroup;
  constructor(
    private fb: FormBuilder,
    private popModal: PopModalService,
    private session: SessionService,
    private sched: ScheduleService,
    private datePipe: DatePipe
  ) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      repeat: ['', Validators.required],
      date: ['', Validators.required],
      daysOfWeek: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getSession();

    this.setExistingData();
  }

  /* FETCH SESSION */
  private userId?: number;
  public getSession = async () => {
    this.userId = await this.session.getUser();
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

  /* CLOSE THE MODAL */

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

  /* END */

  /* VALIDATORS */

  public validators = (inputs: any): boolean => {
    if ((inputs?.dirty || inputs?.touched) && inputs?.invalid) {
      return false;
    }

    return true;
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

  // CONVERT START AND END TIME TO 24HOUR FORMAT

  private transformTimeToDate = (timeValue: string) => {
    const dateToday = new Date().toISOString().split('T')[0];
    /*    startTime: new Date(dateToday + 'T' + '18:30'), */
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
        let newFormat: Date = this.transformTimeToDate(setValue);
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
        let newFormat: Date = this.transformTimeToDate(setValue);
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
        console.log('Success');
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
      this.newStartTime = this.transformDateToTime(this.updateData?.startTime);
      this.newEndTime = this.transformDateToTime(this.updateData?.endTime);
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

  /* TRANSFORM DATA OBJECT TO 12HR FORMAT */

  public transformDateToTime = (date: Date): string => {
    const time = this.datePipe.transform(date, 'h:mm a') || '6:00 AM';

    return time;
  };

  /* UPDATE DATA */
  schedId: number = 0;
  public udpateSchedule = async () => {
    this.prepareFormValues();
    this.userInput.markAllAsTouched();

    if (this.userInput.value) {
      await this.sched
        .updateSchedInfo(this.schedId, this.userInput.value)
        .then(() => {
          this.popModal.isModalOpen(false);
        });
    }
  };
}