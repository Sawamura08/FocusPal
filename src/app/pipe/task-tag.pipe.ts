import { Pipe, PipeTransform } from '@angular/core';
import { TASK_TAGS_PERSONAL } from '../interfaces/export.object';

@Pipe({
  name: 'taskTagPersonal',
})
export class TaskTagPerosnalPipe implements PipeTransform {
  public tagPersonal: string = '';
  public category = TASK_TAGS_PERSONAL;
  transform(value: number): string {
    return (this.tagPersonal = this.category[value]);
  }
}
