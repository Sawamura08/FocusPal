export interface ErrorResponse {
  success: boolean;
  message: string;
  value?: boolean;
  updateKeyValue?: any;
}

export interface SucessResponse {
  success: boolean;
  message: string;
  value: any;
  updateKeyValue?: any;
}
