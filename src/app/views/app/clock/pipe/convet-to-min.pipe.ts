import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToMin',
})
export class ConvertToMin implements PipeTransform {
  private convertedMin: number = 0;
  transform(value: number): number {
    this.convertedMin = value / 60;
    return this.convertedMin;
  }
}
