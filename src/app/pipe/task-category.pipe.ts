import { Pipe, PipeTransform } from '@angular/core';
import { categories } from '../interfaces/export.object';

@Pipe({
  name: 'taskCategory',
})
export class TaskCategoryPipe implements PipeTransform {
  public taskCategory: string = '';
  public category = categories;
  transform(value: number): string {
    if (value === this.category.PERSONAL) {
      return (this.taskCategory = 'Personal');
    } else {
      return (this.taskCategory = 'Academic');
    }
  }
}
