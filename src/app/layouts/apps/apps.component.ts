import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopModalService, updateMode } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

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
    private popModal: PopModalService,
    private location: Location
  ) {}
  buttonStatus = [
    { status: buttons.HOME, label: 'apps', path: '/apps/apps' },
    { status: buttons.CALENDAR, label: 'calendar', path: '/apps/calendar' },
    { status: buttons.CHECK_LIST, label: 'task', path: '/apps/task' },
    { status: buttons.CLOCK, label: 'clock', path: '/apps/clock' },
  ];
  valuePath: string | null = '/apps/apps';

  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();
    this.addTaskSubscribe();

    // SET THE URL PATH
    this.valuePath = this.location.path();
  }

  public navigate = (button: { path: string; label: string }) => {
    this.valuePath = button.path;

    this.route.navigate([button.label], { relativeTo: this.actRoute });
  };

  public buttonStyle = (path: string) => {
    return this.valuePath === path ? 'selected' : '';
  };

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: updateMode | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = value),
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
