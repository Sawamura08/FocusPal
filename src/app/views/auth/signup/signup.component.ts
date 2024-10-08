import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, filter } from 'rxjs';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatchPassValidator } from './match-pass-validator';
import { NetworkStatusService } from '../../../service/network-status.service';
import { UserCreationService } from '../services/user-creation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopModalService } from '../../../service/pop-modal.service';
import { ModalType } from '../../../service/pop-modal.service';
import { SessionService } from '../../../service/session.service';
import { User } from '../../../database/db';
import { TermsAgreementService } from '../../../service/terms-agreement.service';

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
  userDatas: FormGroup;
  constructor(
    private formBuild: FormBuilder,
    private networkService: NetworkStatusService,
    private createUserService: UserCreationService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private popModal: PopModalService,
    private session: SessionService,
    private terms: TermsAgreementService
  ) {
    this.userDatas = this.formBuild.group(
      {
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
    if (this.userDatas.valid && this.networkStatus) {
      this.getUserDecision().then((data) => {
        if (data) {
          this.isLoading = true;
          const userInfo = this.userDatas.value;
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
                  this.userSession = value;
                  this.addSession(this.userSession);
                  this.endLoading(true);
                }
                this.userDatas.reset();
              },
              error: (err) => {
                console.error('User Creation Failed', err);
                this.isLoading = false;
              },
            });
          this.terms.decision(false);
          this.subscriptions.push(this.createUserSubscription);
        }
      });
    } else if (!this.networkStatus) {
      console.log('no internet');
      this.modal = ModalType.NO_INTERNET;
    }
  };

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
    this.networkService.networkStatus$().subscribe((value) => {
      this.networkStatus = value;
    });

    return this.networkStatus;
  };

  /* ------------- JUST A LOADING ------------- */

  isLoading: boolean = false;

  private endLoading = (loginSuccess: boolean) => {
    setTimeout(() => {
      this.isLoading = false;

      if (loginSuccess)
        this.route.navigate(['../login'], { relativeTo: this.actRoute });
    }),
      1500;
  };

  /* ------------- ADD USER FOR INDEXDB -------------- */
  userSession: any;

  private addSession = (user: User) => {
    this.session.addUser(user);
  };

  /* ------------- END ADD USER FOR INDEXDB -------------- */

  /* ------ modal data --------- */
  /* warning email is used */
  modalData: any = {
    title: 'Email have already been used',
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
    this.popModal.getModalStatus().subscribe((data) => (this.modal = data));
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
