import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, of, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NetworkStatusService } from '../../../service/network-status.service';
import { ModalType } from '../../../service/pop-modal.service';
import { PopModalService } from '../../../service/pop-modal.service';
import { SessionService } from '../../../service/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameUserDataService } from '../../../database/game-user-data.service';
import { LeaderboardsService } from '../../../service/leaderboards.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  public passStatus: boolean = false;
  public isPassVisible: boolean = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private networkService: NetworkStatusService,
    private popModal: PopModalService,
    private session: SessionService,
    private gameConfig: GameUserDataService,
    private leaderboard: LeaderboardsService
  ) {
    this.userInput = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkNetworkStatus();
    this.modalSubscribe();

    /* FETCH SESSION */
    this.fetchUserID();
  }

  /* FORM GROUP */

  public userInput: FormGroup;
  private userSubscribe!: Subscription;
  public formSubmitted: boolean = false;

  public submitForms = (): void => {
    const user = this.userInput.value;
    this.formSubmitted = true;
    if (this.networkStatus) {
      this.userSubscribe = this.auth.userAuth(user).subscribe({
        next: (values) => {
          if ('success' in values && !values.success) {
            this.modal = ModalType.INCORRECT;
          } else {
            this.insertUserLeaderboard(values.updateKeyValue.userId);
            this.insertUserGameData();
          }
        },
        error: (err) => {
          console.error('Auth Failed', err);
        },
      });
    } else {
      this.modal = ModalType.NO_INTERNET;
    }
    this.formSubmitted = false;
    this.userInput.reset();
  };

  //Getter method to check if the email input in the form is valid
  get email() {
    return this.userInput.get('email');
  }

  get password() {
    return this.userInput.get('password');
  }

  /* END OF FORM GROUP */

  public disableBtn = () => {
    return this.formSubmitted ? { opacity: 0.7 } : { opacity: 1 };
  };

  public checkPass = () => {
    this.passStatus = !this.passStatus;
    this.isPassVisible = !this.isPassVisible;
  };

  public signUp = () => {
    this.router.navigate(['../signup'], { relativeTo: this.route });
  };

  private authSucess = (): void => {
    this.router.navigate(['../../apps/home'], { relativeTo: this.route });
  };

  /* ------------- CHECKING THE NETWORK IF ONLINE OR OFFLINE -------------*/

  private networkStatus: boolean = false;
  private checkNetworkStatus = (): void => {
    this.networkService
      .networkStatus$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on network Subscribe', err);
          return of(false);
        })
      )
      .subscribe((value) => {
        this.networkStatus = value;
      });
  };

  /* ------------- END CHECKING THE NETWORK IF ONLINE OR OFFLINE -------------*/

  /* ------ modal data --------- */
  /* warning email is used */
  modalIncorrect: any = {
    title: 'Incorrect Email or Password',
    imgPath: '/extra/warning.png',
  };

  /* warning No Internet */
  modalNoInternet: any = {
    title: 'No Internet Connection',
    imgPath: '/extra/warning.png',
  };

  public ModalType = ModalType;
  modal: ModalType = ModalType.NONE;

  private modalSubscribe = () => {
    this.popModal
      .getModalStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error ON Subsribe for modal', err);
          return EMPTY;
        })
      )
      .subscribe((modalValue) => (this.modal = modalValue));
  };

  /* ------ END modal data --------- */

  /* INSERT USER GAME DATA */
  public insertUserGameData = async () => {
    if (this.userId != undefined) {
      const result = await this.gameConfig.insertNewUser(this.userId);

      if (result.value != undefined) {
        this.authSucess();
      }
    }
  };

  /* insert leaderboard data */
  public insertUserLeaderboard = (userId: number) => {
    this.leaderboard
      .insertNewUser(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log(value);
      });
  };

  /* SESSION */
  public userId: number | undefined;
  public fetchUserID = () => {
    this.session
      .getUser()
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => (this.userId = value?.userId));
  };

  // unsubscribing

  ngOnDestroy(): void {
    if (this.userSubscribe) this.userSubscribe.unsubscribe();
  }
  // END OF unsubscribing
}
