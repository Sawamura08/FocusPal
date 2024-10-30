import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopModalService, updateMode } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { buttonValues, navigation } from '../../class/navigation';

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
export class AppsComponent extends navigation implements OnInit, OnDestroy {
  private subscriptionArr: Subscription[] = [];
  constructor(
    route: Router,
    actRoute: ActivatedRoute,
    private popModal: PopModalService,
    location: Location
  ) {
    super(location, route, actRoute);
  }

  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();

    /* SUBSCRIBE FOR CHAT MODAL */
    this.getChatModalStatus();

    // SET THE URL PATH
    this.valuePath = this.location.path();
  }

  public navigate = (button: buttonValues) => {
    super.navigateRoute(button);
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
      next: (value) =>
        (this.modalStatus = {
          mode: false,
          isOpen: true,
        }),
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
