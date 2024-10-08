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

  /* CLOSE THE MODAL */

  public closeModal = () => {
    this.popModal.addListModal(false);
  };

  /* END */
}
