export interface IToday {
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
