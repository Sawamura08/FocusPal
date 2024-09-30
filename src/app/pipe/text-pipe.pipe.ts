import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textPipe',
})
export class TextPipePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 1) {
      return 'Low Priority';
    } else if (value === 2) {
      return 'Medium Priority';
    } else {
      return 'High Priority';
    }
  }
}
