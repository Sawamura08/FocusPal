import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatabaseService } from '../../../database/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatchPassValidator } from './match-pass-validator';
import { NetworkStatusService } from '../../../service/network-status.service';
import { UserCreationService } from '../services/user-creation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.checkNetworkStatus();
  }

  userDatas: FormGroup;
  constructor(
    private formBuild: FormBuilder,
    private networkService: NetworkStatusService,
    private createUserService: UserCreationService,
    private route: Router,
    private actRoute: ActivatedRoute
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
    if (this.userDatas.valid) {
      this.isLoading = true;
      const userInfo = this.userDatas.value;
      this.createUserSubscription = this.createUserService
        .createUser(userInfo)
        .subscribe({
          next: (value) => {
            if ('error' in value) {
              console.log(value.error);
              this.endLoading(false); // not yet finished  exist email
            } else {
              this.endLoading(true);
              this.userDatas.reset();
            }
            console.log(JSON.stringify(value, null, 2));
          },
          error: (err) => {
            console.error('User Creation Failed', err);
            this.isLoading = false;
          },
        });
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
    this.networkService.nextworkStatus$().subscribe((value) => {
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

  /* ------------- DESTROY AND UNSUBSCRIBE ------------- */

  ngOnDestroy(): void {
    if (this.createUserSubscription) this.createUserSubscription.unsubscribe();
  }
}
