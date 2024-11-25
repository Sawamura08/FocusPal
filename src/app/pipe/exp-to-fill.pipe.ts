import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expToFill'
})
export class ExpToFillPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
