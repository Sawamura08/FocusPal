import { FormGroup } from '@angular/forms';

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

  public setCategoryValue = (
    categoryValue: number,
    priority: number,
    subTask: string[]
  ) => {
    this.userInput.get('taskCategory')?.setValue(categoryValue);
    this.userInput.get('priority')?.setValue(priority);
    this.userInput.get('subTask')?.setValue(subTask);
  };

  /* END */
}
