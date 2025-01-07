import { Component, Input, OnInit } from '@angular/core';
import { ModalType, PopModalService } from '../../service/pop-modal.service';
import { slideDown } from './slide-down';
import { FirebaseAuthService } from '../../service/firebase-auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [slideDown],
})
export class ModalComponent implements OnInit {
  constructor(
    private popModal: PopModalService,
    protected firebaseAuth: FirebaseAuthService
  ) {}
  @Input() data: any;
  @Input() confirmation: boolean | null = null;
  public animateModal: boolean = true;
  text: boolean = false;

  ngOnInit(): void {
    this.text = this.confirmationModal();

    this.fetchUserCredentials();
  }

  /* NORMAL MODAL */
  public close = () => this.popModal.closeModal();
  /* END */

  /* -------------- UPDATE SECTION --------------- */

  /* CONFIRMATION MODAL MODE*/
  // text is used to determined to display the confirmattion text
  public confirmationModal = (): boolean => {
    if (this.data.isConfirm || this.confirmation) {
      this.confirmation = true;
      return true;
    }
    return false;
  };

  /* END */

  /* CANCEL */

  public cancel = () => {
    this.animateModal = false;
    setTimeout(() => {
      this.popModal.sendValueModal(false);
      this.popModal.setConfirmaModalStatus(false);
    }, 200);
  };

  /* END */

  /* CONFIRM */
  public confirm = () => {
    this.popModal.sendValueModal(true);
    this.animateModal = false;
  };
  /* END */

  public credentials: any;
  /* GET USER CREDENTAILS FOR VERIFICATION */
  public fetchUserCredentials = () => {
    this.credentials = this.firebaseAuth.getUserCredential()();
  };

  public resendEmailVerify = () => {
    this.firebaseAuth.sendEmail(this.credentials);
    this.popModal.openModal(ModalType.SUCCESSFUL);
  };
}
