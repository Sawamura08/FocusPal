import { DestroyRef, inject } from '@angular/core';
import { chatEntry, histories } from '../interfaces/message-model.interface';
import { ConversationHistoryService } from '../service/conversation-history.service';
import { SessionService } from '../service/session.service';
import { catchError, EMPTY, filter, of, switchMap, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../database/db';

export class chatBot {
  constructor(
    protected historyService: ConversationHistoryService,
    protected session: SessionService
  ) {
    this.getSession();
  }

  public destroyRef = inject(DestroyRef);
  /* AI HISTORY */
  public histories: histories[] = [
    {
      role: 'user',
      parts: [{ text: 'Hello' }],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Hi there! I’m Sydney, your task management assistant. How could I help you?',
        },
      ],
    },
  ];

  /* FETCH HISTORY FROM BACKGEND */

  public getHistory = (userData: User | undefined) => {
    let userId: number = userData != undefined ? userData.userId : 0;
    return this.historyService.fetchUserHistory(userId);
  };

  /* GET SESSION */

  public getSession = () => {
    return this.session
      .getUser()
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(undefined);
        }),
        switchMap((userData: User | undefined) => this.getHistory(userData))
      )
      .subscribe((value) => this.historyConfig(value));
  };

  /* SET THE FETCH HISTORIES TO THE FORMAT OF GOOGLE AI */
  public historyConfig = (history: backendHistory[]) => {
    // in order to copy the sturcure of Histories
    let updatedHistory: histories;
    for (let data of history) {
      updatedHistory = {
        role: data.role,
        parts: [{ text: data.text }],
      };

      this.histories.push(updatedHistory);
    }

    this.historyService.setNewHistory(this.histories);
  };
}

export interface backendHistory {
  id?: number;
  userId: number;
  role: 'user' | 'model';
  text: string;
}
