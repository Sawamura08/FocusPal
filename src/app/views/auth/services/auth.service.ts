import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { auth, authResponse } from '../../../interfaces/auth.inferface';
import { ErrorResponse } from '../../../interfaces/error-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private readonly url = 'http://192.168.1.7:7242/api/user/UserAuth';

  public userAuth = (user: auth): Observable<authResponse | ErrorResponse> => {
    return this.http.post<authResponse>(this.url, user).pipe(
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
