import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { subTaskTypes, taskFilter } from '../interfaces/Request';

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

  public setCategoryValue = (subTask: subTaskTypes[]) => {
    this.userInput.get('subTasks')?.setValue(subTask);
  };

  /* END */

  /* SET VALUES ON CHANGE UI */

  public setValueOnChange = (value: any, fieldName: string) => {
    this.userInput.get(fieldName)?.setValue(value);
  };

  /* END */

  /* FORM FILTER CHOICES */

  public taskLevels: string[] = ['Low', 'Medium', 'High'];

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

  /* END */

  public formList: string[] = ['category', 'tags', 'status', 'priority'];

  public formNameList: { [key: string]: number | undefined } = {
    category: undefined,
    tags: undefined,
    status: undefined,
    priority: undefined,
  };

  public resetUserForm = (formList: string[]) => {
    formList.forEach((form) => {
      this.userInput?.get(form)?.setValue(null);
    });
  };
}
