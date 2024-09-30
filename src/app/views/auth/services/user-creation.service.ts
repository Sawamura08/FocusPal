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

  private readonly URL = 'http://192.168.1.3:7242/api/user/CreateUser';

  public createUser = (
    userInfo: userCreation
  ): Observable<userCreation | ErrorResponse> => {
    return this.http.post<userCreation>(this.URL, userInfo).pipe(
      catchError((error) => {
        const errorResponse: ErrorResponse = {
          success: false,
          message: error.error?.message || 'Unknown error occurred',
        };
        return of(errorResponse); // return as an Observable<ErrorResponse>
      })
    );
  };
}
