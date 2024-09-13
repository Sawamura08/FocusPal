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

  private readonly url = 'https://192.168.1.4:7242/api/user/UserAuth';

  public userAuth = (user: auth): Observable<authResponse | ErrorResponse> => {
    return this.http.post<authResponse>(this.url, user).pipe(
      catchError((error) => {
        return of({ success: false, message: 'Authentication Failed' });
      })
    );
  };
}
