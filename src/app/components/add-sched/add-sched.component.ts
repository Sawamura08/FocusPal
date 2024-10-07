import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopModalService } from '../../service/pop-modal.service';

@Component({
  selector: 'app-add-sched',
  templateUrl: './add-sched.component.html',
  styleUrl: './add-sched.component.scss',
})
export class AddSchedComponent {
  date: string = '';
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
    console.log(this.typeRepeat[type]);
  };

  /* END */

  /* DAYS OF THE WEEK */
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
  public selectDays = (days: number) => {
    this.daysSelected.push(days);
  };

  /* END */

  /* CLOSE THE MODAL */

  public closeModal = () => {
    this.popModal.addListModal(false);
  };

  /* END */
}
