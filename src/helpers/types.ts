export interface IToday {
  date: number;
  day: string;
  dayNum: number;
  month: string;
  year: number;
  ordinal: Function;
}

export interface IHabit {
  name: string;
  days: Boolean[];
  schedule: Number[];
  color: string;
  streak: number;
}
