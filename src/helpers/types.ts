export interface IToday {
  fullDate: Date;
  fullDateString: string;
  date: number;
  day: string;
  dayNum: number;
  month: string;
  year: number;
  ordinal: string;
}

export interface IHabit {
  name: string;
  days: boolean[];
  schedule: number[];
  color: string;
  streak: number;
}

export interface IModal {
  // habit
  name: string;
  days: boolean[];
  schedule: number[];
  color: string;
  streak: number;

  habitIndex: number;
  longestStreak: number;
}
