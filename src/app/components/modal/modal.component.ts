import { Component, Input, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  constructor(private popModal: PopModalService) {}
  @Input() data: any;

  text: boolean = false;

  ngOnInit(): void {}

  public close = () => this.popModal.closeModal();
}
