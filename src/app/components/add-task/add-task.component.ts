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
      next: (value) => (this.modalStatus = value),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });
  };
}
