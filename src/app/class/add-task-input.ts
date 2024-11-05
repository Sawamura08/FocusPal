import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddTaskInput {
  public userInput: FormGroup;
  constructor(group: FormGroup) {
    this.userInput = group;
  }

  /* ERROR CHECKER */

  public errorChecker = (fieldName: string): boolean => {
    if (fieldName) {
      const field = this.userInput.get?.(fieldName);

      if ((field?.dirty || field?.touched) && field?.invalid) {
        return false;
      }

      return true;
    }

    return false;
  };

  /* END */

  /* SET VALUES */

  public setCategoryValue = (subTask: string[]) => {
    this.userInput.get('subTask')?.setValue(subTask);
  };

  /* END */

  /* SET VALUES ON CHANGE UI */

  public setValueOnChange = (value: number | string[], fieldName: string) => {
    this.userInput.get(fieldName)?.setValue(value);
  };

  /* END */

  /* TASK PRIORITY LEVEL */
  public taskLevels: string[] = ['Low', 'Medium', 'High'];

  /* TASK TAGS */
  public taskTagsPersonal: string[] = [
    'Health',
    'Finance',
    'Errands',
    'Fitness',
    'Social',
    'Organization',
    'Others',
  ];

  public taskTagsAcademic: string[] = [
    'Homework',
    'Exams',
    'Projects',
    'Reading',
    'Research',
    'Organization',
    'Others',
  ];

  public taskCategory: string[] = ['Personal', 'Academic'];

  public taskStatus: string[] = ['In Progress', 'Completed', 'Past Due'];
}
