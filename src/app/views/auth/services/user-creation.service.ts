import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { userCreation } from '../../../interfaces/auth.inferface';
import { AuthService } from './auth.service';
import { ErrorResponse } from '../../../interfaces/error-response';

@Injectable({
  providedIn: 'root',
})
export class UserCreationService {
  constructor(private http: HttpClient, private catchErr: AuthService) {}

  private readonly URL = 'https://192.168.1.4:7242/api/user/CreateUser';

  public createUser = (
    userInfo: userCreation
  ): Observable<userCreation | ErrorResponse> => {
    return this.http.post<userCreation>(this.URL, userInfo).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  };
}
