import { Injectable } from '@angular/core';
import { ErrorResponse, SucessResponse } from '../interfaces/error-response';

@Injectable({
  providedIn: 'root',
})
export class ResponseService {
  constructor() {}

  public errorResponse = (): ErrorResponse => {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  };

  public successResponse = (value: any): SucessResponse => {
    return {
      success: true,
      message: 'Operation completed successfully.',
      value: value,
    };
  };
}
