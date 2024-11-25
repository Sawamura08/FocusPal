import { Component, OnInit } from '@angular/core';
import { Motivation } from '../../class/motivation';
import useConfetti from 'canvas-confetti';
import { slideDown } from '../modal/slide-down';
import { GamifiedCompletionService } from './service/gamified-completion.service';
import { modalStatus } from '../../Objects/modal.details';
import { userGameData } from '../../interfaces/game.interface';
import { screenshot } from './screenshot';
import { GameUserDataService } from '../../database/game-user-data.service';
import { expToFill, rankInfo } from '../../interfaces/game';
import { RankUpService } from '../../service/rank-up.service';

@Component({
  selector: 'app-gamified-completion-modal',
  templateUrl: './gamified-completion-modal.component.html',
  styleUrl: './gamified-completion-modal.component.scss',
  animations: [slideDown],
})
export class GamifiedCompletionModalComponent implements OnInit {
  constructor(
    protected game: GamifiedCompletionService,
    protected gameData: GameUserDataService,
    protected rankUp: RankUpService
  ) {
    /* FETCH MOTIVATION CLASS */
    this.motivation = new Motivation();

    this.screenshot = new screenshot();

    /* trigger confetti */
    this.triggerConfetti();
  }

  ngOnInit(): void {
    this.getMotivationalPhrase();

    // GET USER GAME DATA
    this.fetchUserGameData();
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
      this.game.setCompletionModalStatus(modalStatus.close);
    }, 200);
  };

  /* configure completion data */
  public userData: userGameData | undefined;
  public updatedUserData: userGameData | undefined;
  public newExp: number = 0;
  public neededExp: number = 0;
  public fetchUserGameData = () => {
    this.userData = this.game.getCompletionModalValue()();

    if (this.userData) {
      // ADD EXP TO THE CURRENT EXP
      const EXP = 20;
      this.newExp = this.userData.currentExp + EXP;
      /* configuration */
      this.neededExpToRankUp();

      // close userData
      this.updatedUserData = structuredClone(this.userData);

      // check whether the user will rank up
      if (this.newExp < this.userData.nextLevelExp) {
        this.setUpdateCommonConfig();
      } else {
        this.setUpdateRankUpConfig();
      }
    }
  };

  /* WHICH BADGE TO DISPLAY */
  public setUserBadgeRank = (rank: number) => {
    return `ranks/${rank}.png`;
  };

  public neededExpToRankUp = () => {
    const currentExp = this.newExp;
    const expToRankUp = this.userData?.nextLevelExp;

    return (this.neededExp = expToRankUp! - currentExp!);
  };

  // EXP UPDATE IF THE USER DON'T RANK UP
  public setUpdateCommonConfig = () => {
    if (this.updatedUserData != undefined) {
      this.updatedUserData.currentExp = this.newExp;

      // trigger update
      this.userDataUpdate(this.updatedUserData);
    }
  };

  public setUpdateRankUpConfig = async () => {
    if (this.updatedUserData != undefined) {
      // get the new rank of the user
      const newRank: rankInfo = this.updatedUserData.rank + 1;
      const rank: any = rankInfo[newRank] ?? null;
      const newExpGoal: string = expToFill[rank];
      // configure new data
      this.updatedUserData.rank++;
      this.updatedUserData.currentExp = this.newExp;
      this.updatedUserData.nextLevelExp = parseInt(newExpGoal);

      const result = await this.userDataUpdate(this.updatedUserData);

      // 1 === if the update is success
      if (result.success && result.value === 1) {
        // set 1s delay on opening rank up modal
        setTimeout(() => {
          this.rankUp.setRankUpModalData(this.updatedUserData!);
          this.rankUp.setRankUpModalStatus(modalStatus.open);
        }, 1000);
      }
    }
  };

  public userDataUpdate = async (data: userGameData) => {
    const result = await this.gameData.updateUserData(data);
    return result;
  };

  /* END */

  /* SHARE BUTTON */
  public isShareClick: boolean = false;
  public share = (element: string) => {
    if (!this.isShareClick) {
      this.screenshot.captureElement(element);
      this.isShareClick = true;
      this.closeModal();
    }
  };
}
