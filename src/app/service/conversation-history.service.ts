import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, of } from 'rxjs';
import { backendHistory } from '../class/chat-bot';
import { ResponseService } from './reponse.service';
import { histories } from '../interfaces/message-model.interface';

@Injectable({
  providedIn: 'root',
})
export class ConversationHistoryService {
  constructor(
    protected http: HttpClient,
    protected response: ResponseService
  ) {}

  /* FETCHING USER HISTORY */
  private readonly url =
    'http://192.168.1.50:7242/api/AiConversation/GetConversationAsync';

  public fetchUserHistory = (userId: number): Observable<backendHistory[]> => {
    return this.http.post<backendHistory[]>(this.url, userId).pipe(
      catchError((err) => {
        console.error(this.response.errorResponse());
        return of(err);
      })
    );
  };

  public UpdatedHistory$ = new BehaviorSubject<histories[]>([]);

  public setNewHistory = (history: histories[]) => {
    this.UpdatedHistory$.next(history);
  };

  public getUpdatedHistory = () => {
    return this.UpdatedHistory$.asObservable();
  };

  private readonly saveConvoUrl =
    'http://192.168.1.50:7242/api/AiConversation/InsertConvo';

  public saveConversation = (
    data: backendHistory
  ): Observable<backendHistory> => {
    return this.http.post<backendHistory>(this.saveConvoUrl, data).pipe(
      catchError((err) => {
        console.error(this.response.errorResponse());
        return of(err);
      })
    );
  };

  private readonly deleteConvoUrl =
    'http://192.168.1.50:7242/api/AiConversation/DeleteConversation';

  public deleteConversation = (userId: number): Observable<number> => {
    return this.http.post<number>(this.deleteConvoUrl, userId).pipe(
      catchError((err) => {
        console.error(this.response.errorResponse());
        return of(err);
      })
    );
  };
}
