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
import { RankUpService } from '../../service/rank-up.service';
import { NetworkStatusService } from '../../service/network-status.service';
import { catchError, filter, of, switchMap, take } from 'rxjs';
import { SessionService } from '../../service/session.service';
import { LeaderboardSyncService } from '../../components/gamified-completion-modal/service/leaderboard-sync.service';

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
    private gamified: GamifiedCompletionService,
    private rankUp: RankUpService,
    private network: NetworkStatusService,
    private session: SessionService,
    private leader: LeaderboardSyncService
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

    /* GET SESSION */
    this.getSession();

    /* CHECK NETWORK */
    this.checkNetworkStatus();
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

  /* MODAL FOR RANK UP */

  public fetchRankUpModalStatus = () => {
    return this.rankUp.getRankUpModalStatus()();
  };

  /* END */

  /* CHECK NETWORK STATUS */
  public networkStatus: boolean | undefined;
  public checkNetworkStatus = () => {
    this.network
      .networkStatus$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          return err;
        })
      )
      .subscribe((value: any) => {
        this.networkStatus = value;
        if (this.userId !== undefined) {
          this.checkUserLeaderboardUpdate();
        }
      });
  };

  /* END */

  /* CHECK IF THERE COULD BE AN UPDATE */
  /* CHECKING IF THE INDEXEDB(isUpdate) IS OUTDATED */
  public checkUserLeaderboardUpdate = async () => {
    if (this.networkStatus && this.userId !== undefined) {
      const result = await this.leader.checkUpdateStatus(this.userId);

      if (result && result.value != undefined && result.value.isUpdated === 0) {
        this.leader.updateUserData(result.value);
      }
    }
  };

  /* END */

  /* SESSION */
  public userId: number = 0;
  public getSession = () => {
    this.session
      .getUser()
      .pipe(
        filter((value) => value !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.userId = value.userId;
        this.checkUserLeaderboardUpdate();
      });
  };

  /* END */

  ngOnDestroy(): void {}
}
