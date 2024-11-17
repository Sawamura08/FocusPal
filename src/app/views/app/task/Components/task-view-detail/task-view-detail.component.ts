import { Component, Input } from '@angular/core';
import { Task } from '../../../../../database/db';

@Component({
  selector: 'app-task-view-detail',
  templateUrl: './task-view-detail.component.html',
  styleUrl: './task-view-detail.component.scss',
})
export class TaskViewDetailComponent {
  constructor() {}

  @Input() details!: Task;
}
