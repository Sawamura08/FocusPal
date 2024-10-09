import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopModalService } from '../../service/pop-modal.service';
import { SessionService } from '../../service/session.service';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../database/schedule.service';

@Component({
  selector: 'app-add-sched',
  templateUrl: './add-sched.component.html',
  styleUrl: './add-sched.component.scss',
})
export class AddSchedComponent implements OnInit {
  userInput: FormGroup;
  constructor(
    private fb: FormBuilder,
    private popModal: PopModalService,
    private session: SessionService,
    private sched: ScheduleService
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
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
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

  private setRepeatValues = (repeat: number) => {
    if (repeat === 2) {
      if (this.daysSelected.length != 0) {
        this.userInput.get('daysOfWeek')?.setValue(this.daysSelected);
      } else {
        this.currentType = 0;
        this.userInput.get('repeat')?.setValue(this.currentType);
      }
    }
  };

  private transformTimeToDate = (startTime: Date, endTime: Date) => {
    //const start =
    /* const dateToday = new Date().toISOString().split('T')[0]; */
    /*    startTime: new Date(dateToday + 'T' + '18:30'), */
  };

  public prepareFormValues = () => {
    this.userInput.get('repeat')?.setValue(this.currentType);
    this.userInput.get('type')?.setValue(this.categoryCurrentIndex);
    const repeat = this.userInput.get('repeat')?.value;
    this.setRepeatValues(repeat);

    if (repeat != 0) {
      const date = new Date();
      this.userInput.get('date')?.setValue(date);
    }
  };

  public submit = async () => {
    //set the sched value before attempting to submit
    this.prepareFormValues();

    // check all fields
    this.userInput.markAllAsTouched();
    if (this.userInput.valid) {
      //submit the code
      console.log(this.userInput.value);
      // const schedId = await this.sched.insertSched(
      //   this.userId!,
      //   this.userInput.value
      // );

      // if (schedId != 0) {
      //   console.log('Success');
      //   this.closeModal();
      // } else {
      //   console.log('Error!');
      // }
    }
  };

  /* END */
}
