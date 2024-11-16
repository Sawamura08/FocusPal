import { Component } from '@angular/core';
import { PopModalService } from '../../../../../service/pop-modal.service';

@Component({
  selector: 'app-task-filter-control',
  templateUrl: './task-filter-control.component.html',
  styleUrl: './task-filter-control.component.scss',
})
export class TaskFilterControlComponent {
  constructor(private popModal: PopModalService) {}

  public filterTextArr: string[] = ['In Progress', 'Completed', 'Past Due'];

  /* MODAL TASK FILTER MODAL */

  public openTaskFilterModal = () => {
    this.popModal.setTaskFilterSignal(true);
    const value = this.popModal.getTaskFilterSignal()();
  };

  public progressFilterIndex: number = 0;
  public setProgressFilter = (index: number) => {
    this.progressFilterIndex = index;
  };
}
