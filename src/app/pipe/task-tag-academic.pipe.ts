import { Pipe, PipeTransform } from '@angular/core';
import { TASK_TAGS_ACADEMIC } from '../interfaces/export.object';

@Pipe({
  name: 'taskTagAcademic',
})
export class TaskTagAcademicPipe implements PipeTransform {
  public tagAcademic: string = '';
  public category = TASK_TAGS_ACADEMIC;
  transform(value: number): string {
    return (this.tagAcademic = this.category[value]);
  }
}
