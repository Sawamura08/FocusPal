import { ErrorResponse } from '../interfaces/error-response';

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    obj &&
    typeof obj === 'object' &&
    'success' in obj &&
    typeof obj.success === 'boolean' &&
    'message' in obj &&
    typeof obj.message === 'string'
  );
}
