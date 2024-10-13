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
    this.confirmationModal();
  }

  /* NORMAL MODAL */
  public close = () => this.popModal.closeModal();
  /* END */

  /* -------------- UPDATE SECTION --------------- */

  /* CONFIRMATION MODAL MODE*/

  public confirmationModal = () => {
    this.text = this.confirmation ? true : false;
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
