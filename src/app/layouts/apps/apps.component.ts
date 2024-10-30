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
  private subscriptionArr: Subscription[] = [];
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

    /* SUBSCRIBE FOR CHAT MODAL */
    this.getChatModalStatus();

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

  /* ---------------- MODALS ----------------- */

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: updateMode | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = value),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });

    this.subscriptionArr.push(this.addTaskSubscription);
  };
  /* END */

  /* OPEN ADD TASK */
  public openModal = () => {
    const mode: updateMode = {
      mode: false,
      isOpen: true,
    };
    this.popModal.changeAddTaskModalStatus(mode);
  };
  /* END */

  /* CHAT WITH SYDNEY MODAL */

  public isAiChatOpen: boolean = false;
  private chatModalSubscription!: Subscription;

  private getChatModalStatus = () => {
    this.chatModalSubscription = this.popModal.getChatModalStatus().subscribe({
      next: (value) => (this.isAiChatOpen = value),
      error: (err) => console.error('Error on Subscribe chatModal', err),
    });

    this.subscriptionArr.push(this.chatModalSubscription);
  };

  /* END */

  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
