export enum pomoPalBtn {
  Pomodoro = 0,
  ShortBreak = 1,
  LongBreak = 2,
}

export const defaultTime: defaultTimeType = {
  Pomodoro: 1500,
  ShortBreak: 300,
  LongBreak: 900,
};

export interface defaultTimeType {
  Pomodoro: number;
  ShortBreak: number;
  LongBreak: number;
}

export const timerType = {
  Seconds: 'Seconds',
  Minutes: 'Minutes',
};
