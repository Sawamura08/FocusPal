import { Component, Input, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { slideDown } from './slide-down';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [slideDown],
})
export class ModalComponent implements OnInit {
  constructor(private popModal: PopModalService) {}
  @Input() data: any;
  @Input() confirmation: boolean | null = null;
  text: boolean = false;

  ngOnInit(): void {
    this.text = this.confirmationModal();
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
    this.popModal.sendValueModal(false);
    this.popModal.setConfirmaModalStatus(false);
  };

  /* END */

  /* CONFIRM */
  public confirm = () => {
    this.popModal.sendValueModal(true);
  };
  /* END */
}
