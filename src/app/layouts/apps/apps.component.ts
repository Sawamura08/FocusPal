import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopModalService, updateMode } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';

enum buttons {
  HOME,
  CALENDAR,
  CHECK_LIST,
  CLOCK,
}
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent implements OnInit, OnDestroy {
  constructor(
    private route: Router,
    private actRoute: ActivatedRoute,
    private popModal: PopModalService
  ) {}
  buttonStatus = [
    { status: buttons.HOME, label: 'apps' },
    { status: buttons.CALENDAR, label: 'calendar' },
    { status: buttons.CHECK_LIST, label: 'task' },
    { status: buttons.CLOCK, label: 'clock' },
  ];
  valueStatus: buttons = buttons.HOME;

  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();
    this.addTaskSubscribe();
  }

  public navigate = (button: { status: buttons; label: string }) => {
    this.valueStatus = button.status;

    this.route.navigate([button.label], { relativeTo: this.actRoute });
  };

  public buttonStyle = (status: buttons) => {
    return this.valueStatus === status ? 'selected' : '';
  };

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: updateMode | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = { isOpen: true, mode: false }),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });
  };

  /* OPEN ADD TASK */
  public openModal = () => {
    const mode: updateMode = {
      mode: false,
      isOpen: true,
    };
    this.popModal.changeAddTaskModalStatus(mode);
  };

  ngOnDestroy(): void {
    if (this.addTaskSubscription) this.addTaskSubscription.unsubscribe();
  }
}
