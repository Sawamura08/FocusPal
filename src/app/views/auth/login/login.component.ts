import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NetworkStatusService } from '../../../service/network-status.service';
import { authResponse } from '../../../interfaces/auth.inferface';
import { ErrorResponse } from '../../../interfaces/error-response';

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
    private networkService: NetworkStatusService
  ) {
    this.userInput = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkNetworkStatus();
  }

  /* FORM GROUP */

  public userInput: FormGroup;
  private userSubscribe!: Subscription;
  public formSubmitted: boolean = false;

  public submitForms = (): void => {
    const user = this.userInput.value;
    this.formSubmitted = true;
    if (this.userInput.valid) {
      if (this.networkStatus)
        this.userSubscribe = this.auth.userAuth(user).subscribe({
          next: (values: authResponse | ErrorResponse) => {
            // if ('userId' in values) {
            //   console.log(values.userId);
            // }
            console.log(values);
            //this.authSucess();
          },
          error: (err) => {
            console.error('Auth Failed', err);
          },
        });

      this.userInput.reset();
    }
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
  private checkNetworkStatus = (): boolean => {
    this.networkService.nextworkStatus$().subscribe((value) => {
      this.networkStatus = value;
      console.log('subscribe success', value);
    });

    return this.networkStatus;
  };

  // unsubscribing

  ngOnDestroy(): void {
    if (this.userSubscribe) this.userSubscribe.unsubscribe();
  }
}
