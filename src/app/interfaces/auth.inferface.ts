export interface auth {
  email: string;
  password: string;
}

export interface authResponse {
  userId: number;
  email: string;
  updateKeyValue?: any; //it's not update I just paired it to the errorReponse
}

export interface userCreation {
  userId?: string;
  userName: string;
  email: string;
  password: string;
  ConfirmPassword: string;
  profile: string;
}

export interface userLeaderboard {
  id: string;
  userName: string;
  points: number;
  profile: number;
  lastUpdated: Date;
}
