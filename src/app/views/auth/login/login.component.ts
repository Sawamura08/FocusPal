import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NetworkStatusService } from '../../../service/network-status.service';
import { ModalType } from '../../../service/pop-modal.service';
import { PopModalService } from '../../../service/pop-modal.service';
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  public passStatus: boolean = false;
  public isPassVisible: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private networkService: NetworkStatusService,
    private popModal: PopModalService,
    private session: SessionService
  ) {
    this.userInput = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkNetworkStatus();
    this.modalSubscribe();
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
            this.authSucess();
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

  // public invalidEmail = (): string => {
  //   if (
  //     (this.email?.errors?.['email'] || this.email?.errors?.['required']) &&
  //     (this.email?.touched || this.email?.dirty)
  //   ) {
  //     return 'errors';
  //   } else {
  //     return '';
  //   }
  // };

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
    this.router.navigate(['../../apps/apps'], { relativeTo: this.route });
  };

  /* ------------- CHECKING THE NETWORK IF ONLINE OR OFFLINE -------------*/

  private networkStatus: boolean = false;
  private checkNetworkStatus = (): void => {
    this.networkService.networkStatus$().subscribe((value) => {
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
    this.popModal.getModalStatus().subscribe((data) => (this.modal = data));
  };

  /* ------ END modal data --------- */

  // unsubscribing

  ngOnDestroy(): void {
    if (this.userSubscribe) this.userSubscribe.unsubscribe();
  }
  // END OF unsubscribing
}
