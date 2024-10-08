import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopModalService } from '../../service/pop-modal.service';

@Component({
  selector: 'app-add-sched',
  templateUrl: './add-sched.component.html',
  styleUrl: './add-sched.component.scss',
})
export class AddSchedComponent {
  userInput: FormGroup;
  constructor(private fb: FormBuilder, private popModal: PopModalService) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      repeat: ['', Validators.required],
      date: ['', Validators.required],
      daysOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

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

  public categories: string[] = ['Class', 'Meeting', 'Date', 'Family/Friends'];

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

  /* END */

  /* VALIDATORS */

  public validators = (inputs: any): boolean => {
    if ((inputs?.dirty || inputs?.touched) && inputs?.invalid) {
      return false;
    }

    return true;
  };

  /* END */
}
