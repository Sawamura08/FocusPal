import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TermsAgreementService {
  /* FOR BEHAVIOR OF THE MODAL OF TERMS */
  termsAgreementModalStatus = new BehaviorSubject<boolean>(false);

  constructor() {}

  public openTerms = () => {
    this.termsAgreementModalStatus.next(true);
  };

  public closeTerms = (): void => {
    this.termsAgreementModalStatus.next(false);
  };

  public termsAgreement$ = () => {
    return this.termsAgreementModalStatus.asObservable();
  };

  /* FOR A BEHAVIOR OF THE USER DECISIONS */
  userDecisionStatus = new BehaviorSubject<boolean>(false);

  public decision = (value: boolean) => {
    this.userDecisionStatus.next(value);
  };

  public userDecisionStatus$ = () => {
    return this.userDecisionStatus.asObservable();
  };
}
