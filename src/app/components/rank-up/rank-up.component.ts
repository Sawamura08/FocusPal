import { Component, OnInit } from '@angular/core';
import { screenshot } from '../gamified-completion-modal/screenshot';
import { Motivation } from '../../class/motivation';
import { modalStatus } from '../../Objects/modal.details';
import { RankUpService } from '../../service/rank-up.service';
import { slideDown } from '../modal/slide-down';
import useConfetti from 'canvas-confetti';
import { userGameData } from '../../interfaces/game.interface';

@Component({
  selector: 'app-rank-up',
  templateUrl: './rank-up.component.html',
  styleUrl: './rank-up.component.scss',
  animations: [slideDown],
})
export class RankUpComponent implements OnInit {
  constructor(protected rankUp: RankUpService) {
    /* FETCH MOTIVATION CLASS */
    this.motivation = new Motivation();

    this.screenshot = new screenshot();
  }

  ngOnInit(): void {
    this.getMotivationalPhrase();

    this.triggerConfetti();

    /* FETCH RANK UP DATA */
    this.fetchRankUpData();
  }

  public motivation: Motivation;
  public screenshot: screenshot;
  public phrase: string = '';
  public animateModal: boolean = true;

  /* FETCH MOTIVATIONAL PRHASE */
  public getMotivationalPhrase = () => {
    this.phrase = this.motivation.getRandomPhrase();
  };

  /* CONFETTI CONFIGURATIONS */
  public triggerConfetti = () => {
    setTimeout(() => {
      useConfetti({ particleCount: 1000, spread: 70, origin: { y: 0.6 } });
    }, 500);
  };

  public closeModal = () => {
    this.animateModal = false;

    setTimeout(() => {
      this.rankUp.setRankUpModalStatus(modalStatus.close);
    }, 200);
  };

  /* SHARE BUTTON */
  public isShareClick: boolean = false;
  public share = (element: string) => {
    if (!this.isShareClick) {
      this.screenshot.captureElement(element);
      this.isShareClick = true;
      this.closeModal();
    }
  };

  /* FETCH RANK UP DATA */
  public rankUpData: userGameData | undefined;
  public fetchRankUpData = () => {
    this.rankUpData = this.rankUp.getRankUpModalData()();
  };

  /* SET UP BADGE */
  public setUserBadgeRank = (rank: number) => {
    return `ranks/${rank}.png`;
  };
}
