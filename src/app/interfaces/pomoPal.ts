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

export enum configText {
  'Focus Session' = 0,
  'Short Break' = 1,
  'Long Break' = 2,
  'Long Break After' = 3,
}

export enum updateConfigField {
  pomodoro = 0,
  shortBreak = 1,
  longBreak = 2,
  longBreakAfter = 3,
}

export const timerType = {
  Seconds: 'Seconds',
  Minutes: 'Minutes',
};

export interface pomoTask {
  taskId?: number;
  userId: number;
  title: string;
  pomodoro: number;
  pomodoroCompleted: number;
  description: string;
  status: boolean; // COMPLETED OR IN PROGRESS,
}

export interface userPomoConfig {
  configId?: number;
  userId: number;
  pomodoro?: number; // IN SECONDS
  shortBreak?: number;
  longBreak?: number;
  longBreakAfter?: number; // how many session should take before long break
  music: number; // CHOOSE IF THERE IS MUSIC OR NOT
}

/* SETTINGS */

export const musicConfig = [
  { music: 0, theme: 'None' },
  { music: 1, theme: 'Chill' },
  { music: 2, theme: 'Rainy' },
  { music: 3, theme: 'Bird' },
  { music: 4, theme: 'Dream' },
  { music: 5, theme: 'Flow' },
  { music: 6, theme: 'Insturmental' },
  { music: 7, theme: 'Rainy 2' },
  { music: 8, theme: 'Piano' },
  { music: 9, theme: 'Calm' },
];

export const musicIcon = [
  'fa-ban',
  'fa-face-smile-relaxed',
  'fa-droplet',
  'fa-bird',
  'fa-thought-bubble',
  'fa-water',
  'fa-violin',
  'fa-raindrops',
  'fa-piano-keyboard',
  'fa-face-clouds',
];
