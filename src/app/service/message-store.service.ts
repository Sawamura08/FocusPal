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
  public insertConversation = (message: string) => {
    const currentConversation = this.conversation$.value;

    const chatEntry: chatEntry = {
      message: message,
      response: '',
      isMessageAnimated: false,
      isResponseAnimated: false,
    };

    // ... (3 dots) copy an array or object
    this.conversation$.next([...currentConversation, chatEntry]);
  };

  /* UPDATE THE LATEST CONVO FOR RESPONSE */
  public updateConversation = (result: string) => {
    const currentConversation = this.conversation$.value;
    const latestCoversation = currentConversation.length - 1;
    const updatedConversation = [...currentConversation];

    if (updatedConversation[latestCoversation]) {
      updatedConversation[latestCoversation] = {
        ...updatedConversation[latestCoversation],
        response: result,
        isResponseAnimated: true,
      };

      this.conversation$.next(updatedConversation);
    }
  };

  /* SET THE histories[] to conversation$: chatEntry */
  public setHistories = (histories: histories[]) => {
    const currentConversation = this.conversation$.value;
    let userPrompt: string;
    let modelReponse: string;
    let i = 0;
    histories.map((history) => {
      history.parts.map((response) => {
        if (history.role === 'user') {
          userPrompt = response.text;
        } else {
          modelReponse = response.text;
        }

        const chatEntry: chatEntry = {
          message: userPrompt,
          response: modelReponse,
          isMessageAnimated: true,
          isResponseAnimated: true,
        };

        this.conversation$.next([...currentConversation, chatEntry]);
      });
    });
  };
}
