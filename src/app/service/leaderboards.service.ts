import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ResponseService } from './reponse.service';
import { userCreation, userLeaderboard } from '../interfaces/auth.inferface';
import { updateRequest } from '../views/leaderboards/model/leaderboardClass';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardsService {
  constructor(protected response: ResponseService, private http: HttpClient) {}

  private readonly url =
    'http://192.168.1.10:7242/api/Leaderboard/insertNewUser';

  public insertNewUser = (id: number): Observable<userLeaderboard> => {
    return this.http.post<userLeaderboard>(this.url, id).pipe(
      catchError((err) => {
        this.response.errorResponse();
        return of(err);
      })
    );
  };

  private readonly updateUrl =
    'http://192.168.1.10:7242/api/Leaderboard/updateLeaderboard';

  public updateUserData = (
    data: updateRequest
  ): Observable<userLeaderboard> => {
    return this.http.patch<userLeaderboard>(this.updateUrl, data).pipe(
      catchError((err) => {
        this.response.errorResponse();
        return of(err);
      })
    );
  };
}
