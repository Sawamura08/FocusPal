import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hamburger-interface',
  templateUrl: './hamburger-interface.component.html',
  styleUrl: './hamburger-interface.component.scss',
})
export class HamburgerInterfaceComponent implements OnInit {
  constructor(protected popModal: PopModalService) {}

  ngOnInit(): void {
    this.getChatModalStatus();
  }
  protected destroyRef = inject(DestroyRef);

  /* CHAT WITH SYDNEY MODAL */

  public isAiChatOpen: boolean = false;

  private getChatModalStatus = () => {
    this.popModal
      .getChatModalStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => (this.isAiChatOpen = value),
        error: (err) => console.error('Error on Subscribe chatModal', err),
      });
  };

  /* END */
}
