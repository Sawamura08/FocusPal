import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatEntry, histories } from '../interfaces/message-model.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageStoreService {
  constructor() {
    this.conversation$ = new BehaviorSubject<chatEntry[]>([]);
  }
  public conversation$: BehaviorSubject<chatEntry[]>;

  public getConversation = () => {
    return this.conversation$.asObservable();
  };

  /* ADD NEW CONVO TO EXISTING CONVO */
  /* messageAnimate was for the existing convo to prevent it to animate */
  public insertConversation = (message: string, messageAnimate?: boolean) => {
    const currentConversation = this.conversation$.value;

    const chatEntry: chatEntry = {
      message: message,
      response: '',
      isMessageAnimated: messageAnimate ?? false,
      isResponseAnimated: false,
    };

    // ... (3 dots) copy an array or object
    this.conversation$.next([...currentConversation, chatEntry]);
  };

  /* UPDATE THE LATEST CONVO FOR RESPONSE */
  public updateConversation = (result: string, responseAnimate?: boolean) => {
    const currentConversation = this.conversation$.value;
    const latestCoversation = currentConversation.length - 1;
    const updatedConversation = [...currentConversation];

    if (updatedConversation[latestCoversation]) {
      updatedConversation[latestCoversation] = {
        ...updatedConversation[latestCoversation],
        response: result,
        isResponseAnimated: responseAnimate ?? false,
      };

      this.conversation$.next(updatedConversation);
    }
  };

  /* SET THE histories[] to conversation$: chatEntry */
  public setHistories = (histories: histories[]) => {
    let userPrompt: string;
    let modelReponse: string;

    /* MAP ALL THORUGH THE HISTORY[] */
    histories.map((history) => {
      history.parts.map((response) => {
        if (history.role === 'user') {
          userPrompt = response.text;
          this.insertConversation(userPrompt, true);
        } else {
          modelReponse = response.text;
          this.updateConversation(modelReponse, true);
        }
      });
    });
  };
  /* END */

  /* CLEAR CONVERSATION SUBJECT  */
  /* IT DUPLICATES WHEN I INTIALIZE AGAIN NEEDS TO CLEAR IT*/

  public clearConversation = () => {
    this.conversation$.next([]);
  };
  /* END */
}
