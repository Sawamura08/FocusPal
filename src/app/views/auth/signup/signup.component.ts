import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, combineLatest, filter, take } from 'rxjs';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatchPassValidator,
  noWhitespaceValidator,
} from './match-pass-validator';
import { NetworkStatusService } from '../../../service/network-status.service';
import { UserCreationService } from '../services/user-creation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopModalService } from '../../../service/pop-modal.service';
import { ModalType } from '../../../service/pop-modal.service';
import { SessionService } from '../../../service/session.service';
import { User } from '../../../database/db';
import { TermsAgreementService } from '../../../service/terms-agreement.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirebaseAuthService } from '../../../service/firebase-auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    // checker of the network as observable
    this.checkNetworkStatus();

    //subscribe to the behavaior subject of modal
    this.modalSubscribe();

    // subscribe to the behavior subject of terms & agreement
    this.termsAgreementSubscribe();
  }

  subscriptions: Subscription[] = [];
  public destroyRef = inject(DestroyRef);
  userDatas: FormGroup;
  constructor(
    private formBuild: FormBuilder,
    private networkService: NetworkStatusService,
    private createUserService: UserCreationService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private popModal: PopModalService,
    private session: SessionService,
    private terms: TermsAgreementService,
    private fireAuth: FirebaseAuthService
  ) {
    this.userDatas = this.formBuild.group(
      {
        userName: ['', [Validators.required, noWhitespaceValidator()]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: MatchPassValidator('password', 'confirmPassword') }
    );
  }

  // ------------- GET form inputs -------------
  get email() {
    return this.userDatas.get('email');
  }

  get userName() {
    return this.userDatas.get('userName');
  }

  get password() {
    return this.userDatas.get('password');
  }

  get confirmPassword() {
    return this.userDatas.get('confirmPassword');
  }

  /* ------------- SUBMBIT FOR USER CREATION ------------- */
  createUserSubscription!: Subscription;
  signUpSubmit = () => {
    this.userDatas.markAllAsTouched();
    if (this.userDatas.valid && this.networkStatus) {
      this.getUserDecision().then((data) => {
        if (data) {
          this.isLoading = true;
          const userInfo = this.userDatas.value;
          this.fireAuth
            .signUpAuthFirebase(
              this.userDatas.value.email,
              this.userDatas.value.password
            )
            .then((res) => {
              // check whether the user creation is successful or not
              if (res) {
                this.createUserSubscription = this.createUserService
                  .createUser(userInfo)
                  .subscribe({
                    next: (value) => {
                      if ('success' in value && !value.success) {
                        this.endLoading(false);
                        this.popModal.openModal(ModalType.EMAIL_USED);
                      } else if ('ok' in value && !value.ok) {
                        this.endLoading(false);
                      } else {
                        /* SUCCESS USER CREATION */
                        this.waitUntilEmailModalClose();
                      }
                      this.userDatas.reset();
                    },
                    error: (err) => {
                      console.error('User Creation Failed', err);
                      this.isLoading = false;
                    },
                  });
              }
              this.userDatas.reset();
            });

          this.terms.decision(false);
        }
      });
    } else if (!this.networkStatus) {
      this.modal = ModalType.NO_INTERNET;
    }
  };

  /* WAIT UNTIL THE USER CLOSE THE SENT EMAIL MODAL */
  private _waitUntilEmailModalClose = () => {
    setTimeout(() => {
      return new Promise((resolve, reject) => {
        this.popModal.modalSubject$
          .pipe(
            filter((value) => value === ModalType.NONE),
            take(1),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: () => {
              this.endLoading(true);
              resolve(true);
            },
            error: (err) => reject(err),
          });
      });
    }, 1000);
  };
  public get waitUntilEmailModalClose() {
    return this._waitUntilEmailModalClose;
  }
  public set waitUntilEmailModalClose(value) {
    this._waitUntilEmailModalClose = value;
  }

  disabledBtn = () => {
    if (this.userDatas.valid) {
      return { opacity: '1' };
    } else {
      return { opacity: '0.7' };
    }
  };

  /* -------------view password ------------- */
  passwordVisibility: any = {
    password: false,
    confirmPassword: false,
  };

  toggleVisibility(field: any) {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  /* ------------- CHECKING THE NETWORK IF ONLINE OR OFFLINE -------------*/

  private networkStatus: boolean = false;
  private checkNetworkStatus = (): boolean => {
    this.networkService
      .networkStatus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.networkStatus = value;
      });

    return this.networkStatus;
  };

  /* ------------- JUST A LOADING ------------- */

  isLoading: boolean = false;

  private endLoading = (loginSuccess: boolean) => {
    setTimeout(() => {
      this.isLoading = false;

      if (loginSuccess) {
        this.goToLogin();
      }
    }),
      1500;
  };

  /* ------------- SUCCESS CREATION ------------- */
  public goToLogin = () => {
    setTimeout(() => {
      this.route.navigate(['../login'], { relativeTo: this.actRoute });
    }, 100);
  };

  /* ------------- END ADD USER FOR INDEXDB -------------- */

  /* ------ modal data --------- */
  /* warning email is used */
  modalData: any = {
    title: 'Email have already been used',
    imgPath: '/extra/warning.png',
  };

  successCreation: any = {
    title: 'Account Created',
    subText: 'Check your email & click the link to activate your account.',
    imgPath: '/extra/email.gif',
  };

  InvalidEmail: any = {
    title: 'AThe email format is invalid. Please enter a valid email',
    imgPath: '/extra/check.png',
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => (this.modal = data));
  };

  /* -------- end of modal data -------- */

  /* -----------Modal for terms and agreements ----------- */

  isTermsOpen: boolean = false;
  userDecision: boolean = false;

  termsSubscription!: Subscription;
  private termsAgreementSubscribe = () => {
    /* FOR MODAL TERMS & AGREEMENT */
    this.termsSubscription = this.terms.termsAgreement$().subscribe({
      next: (value) => (this.isTermsOpen = value),
      error: (err) => console.error(err),
    });

    this.subscriptions.push(this.termsSubscription);
  };

  /* FOR USER DECISION */
  userDecisionSubs!: Subscription;
  private getUserDecision = () => {
    return new Promise((resolve, reject) => {
      this.terms.openTerms();

      this.userDecisionSubs = this.terms
        .userDecisionStatus$()
        .pipe(filter((data) => data))
        .subscribe({
          next: (value) => {
            this.userDecision = value;

            // check the decision of the user then send to callback
            this.userDecision
              ? resolve(this.userDecision)
              : reject('Error Reject');
          },
          error: (err) => console.error('Error', err),
        });

      this.subscriptions.push(this.userDecisionSubs);
    });
  };

  /* ----------- END OF Modal for terms and agreements ----------- */

  /* ------------- DESTROY AND UNSUBSCRIBE ------------- */

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }
}
