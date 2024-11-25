import { Pipe, PipeTransform } from '@angular/core';
import { rankInfo } from '../interfaces/game';

@Pipe({
  name: 'ranks',
})
export class RanksPipe implements PipeTransform {
  public ranks: string = '';
  transform(value: number): string {
    return (this.ranks = rankInfo[value]);
  }
}
