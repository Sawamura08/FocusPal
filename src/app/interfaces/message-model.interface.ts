export interface chatEntry {
  message: string;
  response: string;
  isMessageAnimated: boolean;
  isResponseAnimated: boolean;
}

export interface histories {
  role: string;
  parts: {
    text: string;
  }[];
}
