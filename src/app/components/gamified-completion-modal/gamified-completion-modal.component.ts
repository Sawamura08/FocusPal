import { Component, OnInit } from '@angular/core';
import { Motivation } from '../../class/motivation';

@Component({
  selector: 'app-gamified-completion-modal',
  templateUrl: './gamified-completion-modal.component.html',
  styleUrl: './gamified-completion-modal.component.scss',
})
export class GamifiedCompletionModalComponent implements OnInit {
  constructor() {
    /* FETCH MOTIVATION CLASS */
    this.motivation = new Motivation();
  }

  ngOnInit(): void {
    this.getMotivationalPhrase();
  }

  public motivation: Motivation;
  public phrase: string = '';

  public getMotivationalPhrase = () => {
    this.phrase = this.motivation.getRandomPhrase();
  };
}
