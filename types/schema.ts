export interface Account {
  uid: string;
  balance: number;
  userName: string;
}

//the config for a withdraw schedule
export interface WithdrawSchedule {
  uid: string;
  schedule: ScheduleConfig;
  amountPerPayout: number;
  accountID: string;
  nextOccurrenceDate: number;
  totalAmount: number;
  createdDate: number;
  status: ScheduleStatus;
}

export enum ScheduleStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentFrequency {
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
}

export interface ScheduleConfig {
  /**Start date of the schedule */
  dtStart: number;
  /**End date of the schedule */
  until: number;
  /**The frequency of occurrence */
  freq: PaymentFrequency;
  /**Counts between next occurrences */
  interval: number;
  byWeekday?: Weekday[];
  byMonthDay?: number;
}

export interface Weekday {
  /**The index if the day, 0-indexed */
  weekday: number;
  /**The nth occurrence of the weekday e.g 2nd mondays, 3rd fridays */
  n?: number;
}

export interface Transaction {
  uid: string;
  amount: number;
  type: "deposit" | "withdrawal";
  status: "pending" | "completed" | "failed";
  method: string;
  createdDate: number;
}
