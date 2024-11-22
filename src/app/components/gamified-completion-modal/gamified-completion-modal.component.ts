import { Component, OnInit } from '@angular/core';
import { Motivation } from '../../class/motivation';
import useConfetti from 'canvas-confetti';
import { slideDown } from '../modal/slide-down';
import { GamifiedCompletionService } from './service/gamified-completion.service';
import { modalStatus } from '../../Objects/modal.details';
import { userGameData } from '../../interfaces/game.interface';

@Component({
  selector: 'app-gamified-completion-modal',
  templateUrl: './gamified-completion-modal.component.html',
  styleUrl: './gamified-completion-modal.component.scss',
  animations: [slideDown],
})
export class GamifiedCompletionModalComponent implements OnInit {
  constructor(protected game: GamifiedCompletionService) {
    /* FETCH MOTIVATION CLASS */
    this.motivation = new Motivation();

    /* trigger confetti */
    this.triggerConfetti();
  }

  ngOnInit(): void {
    this.getMotivationalPhrase();
  }

  public motivation: Motivation;
  public phrase: string = '';
  public animateModal: boolean = true;

  public getMotivationalPhrase = () => {
    this.phrase = this.motivation.getRandomPhrase();
  };

  public triggerConfetti = () => {
    setTimeout(() => {
      useConfetti({ particleCount: 1000, spread: 70, origin: { y: 0.6 } });
    }, 500);
  };

  public closeModal = () => {
    this.animateModal = false;

    setTimeout(() => {
      this.game.setCompletionModalStatus(modalStatus.close);
    }, 200);
  };

  public meme: userGameData = {
    userId: 12,
    rank: 1,
    currentExp: 10,
    nextLevelExp: 200,
    avatarID: 1,
  };
}
