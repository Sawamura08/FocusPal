import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatEntry } from '../interfaces/message-model.interface';

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
}
