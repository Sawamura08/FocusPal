import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent {
  constructor(protected fb: FormBuilder) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      pomodoro: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  /* FORMS */
  public userInput: FormGroup;

  /* GETTERS */
  get title() {
    return this.userInput.get('title');
  }

  get pomodoro() {
    return this.userInput.get('pomodoro');
  }

  get description() {
    return this.userInput.get('description');
  }

  public errorCheck = (fieldName: string) => {
    const field = this.userInput.get(fieldName);

    if ((field?.dirty || field?.touched) && field.invalid) {
      return false;
    }

    return true;
  };
  /* END */

  /* NUMBER INPUT CONTROLLER */
  public currentPomodoroValue: number = 0;
  public numberInputController = (controller: 'up' | 'down') => {
    const field = this.userInput.get('pomodoro');

    if (controller === 'up' && this.currentPomodoroValue < 10) {
      this.currentPomodoroValue++;
    } else if (controller === 'down' && this.currentPomodoroValue > 0) {
      this.currentPomodoroValue--;
    }

    field?.setValue(this.currentPomodoroValue);
  };

  /* SUBMIT  */
  public submit = () => {
    this.userInput.markAllAsTouched();

    if (this.userInput.valid) {
      console.log(this.userInput.value);
    }
  };

  public isInfoDisplayed: boolean = false;
  public toggleInfo = () => {
    this.isInfoDisplayed = !this.isInfoDisplayed;
  };
}
