import { motivationalPhrases } from '../JSON/motivation';

export class Motivation {
  public motivationPhrases = motivationalPhrases;

  public getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * 20);

    const phrase = this.motivationPhrases[randomIndex];

    return phrase;
  };
}
