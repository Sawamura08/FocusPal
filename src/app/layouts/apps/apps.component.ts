import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopModalService, updateMode } from '../../service/pop-modal.service';
import { Location } from '@angular/common';
import { buttonValues, navigation } from '../../class/navigation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskObservableService } from '../../service/task-observable.service';
import { GamifiedCompletionService } from '../../components/gamified-completion-modal/service/gamified-completion.service';

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
  private destroyRef = inject(DestroyRef);
  constructor(
    route: Router,
    actRoute: ActivatedRoute,
    private popModal: PopModalService,
    location: Location,
    private task$: TaskObservableService,
    private gamified: GamifiedCompletionService
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
  private addTaskSubscribe = () => {
    this.popModal
      .getAddTaskModalStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => (this.modalStatus = value),
        error: (err) => console.error('Error Subscribe Add Task', err),
      });
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

  private getChatModalStatus = () => {
    this.popModal
      .getChatModalStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => (this.isAiChatOpen = value),
        error: (err) => console.error('Error on Subscribe chatModal', err),
      });
  };

  /* END */

  /* FILTE TASK MODAL */
  public fetchTaskFilterSignal = () => {
    return this.popModal.getTaskFilterSignal()();
  };

  /* END */

  /* GAMIFIED COMPLETION MODAL */

  public fetchCompletionModalStatus = () => {
    return this.gamified.getCompletionModalStatus()();
  };

  /* END */

  ngOnDestroy(): void {}
}
