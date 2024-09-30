import { Component } from '@angular/core';
import { TermsAgreementService } from '../../service/terms-agreement.service';
import { termsAnimate } from './terms-animate';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss',
  animations: [termsAnimate],
})
export class TermsConditionsComponent {
  constructor(private terms: TermsAgreementService) {}

  public userDecisions = (decision: boolean) => {
    this.terms.closeTerms();

    // TRUE === ACCEPTING THE TERMS
    // FALSE === CANCEL
    this.terms.decision(decision);
  };
}
