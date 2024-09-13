export interface auth {
  email: string;
  password: string;
}

export interface authResponse {
  userId: number;
}

export interface userCreation {
  userId?: string;
  userName: string;
  email: string;
  password: string;
  ConfirmPassword: string;
}
