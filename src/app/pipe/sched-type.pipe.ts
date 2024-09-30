import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'schedType',
})
export class SchedTypePipe implements PipeTransform {
  schedType: string = '';
  transform(value: number): string {
    if (value === 0) {
      this.schedType = 'Class';
    } else if (value === 1) {
      this.schedType = 'Meeting';
    } else if (value === 2) {
      this.schedType = 'Date';
    } else {
      this.schedType = 'Family/Friends';
    }

    return this.schedType;
  }
}
