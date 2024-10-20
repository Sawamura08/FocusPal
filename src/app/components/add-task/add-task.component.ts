import { Component, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  constructor(private popModal: PopModalService) {}
  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();
  }

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: boolean | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = true),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });
  };

  /* SETTING UP BUTTON ON-CLICKS ON FORMS */
  categoryIndex: number | null = null;
  public selectCategory = (index: number) => {
    this.categoryIndex = index;
  };

  priorityIndex: number | null = null;
  public selectPriority = (index: number) => {
    this.priorityIndex = index;
  };
  /* END */
}
