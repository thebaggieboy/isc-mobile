import { PaymentFrequency, ScheduleConfig } from "@/types/schema";
import { jsWeekdayToRRule } from "./index";
import dayjs from "dayjs";

/**
 * Creates a default schedule configuration for a given frequency
 * @param startDate - The start date for the schedule
 * @param freq - The payment frequency
 * @returns A default ScheduleConfig for the given frequency
 */
export function createDefaultSchedule(
  startDate: Date,
  freq: PaymentFrequency,
): ScheduleConfig {
  const endDateMap = {
    [PaymentFrequency.DAILY]: dayjs(startDate).add(30, "days"),
    [PaymentFrequency.WEEKLY]: dayjs(startDate).add(4, "weeks"),
    [PaymentFrequency.MONTHLY]: dayjs(startDate).add(3, "months"),
  };

  const baseConfig: ScheduleConfig = {
    freq,
    dtStart: startDate.getTime(),
    until: endDateMap[freq].toDate().getTime(),
    interval: 1,
  };

  if (freq === PaymentFrequency.WEEKLY) {
    // Convert JavaScript day (Sunday=0) to RRule day (Monday=0)
    const jsDay = dayjs(startDate).get("day");
    const rruleDay = jsWeekdayToRRule(jsDay);
    baseConfig.byWeekday = [{ weekday: rruleDay }];
  }

  if (freq === PaymentFrequency.MONTHLY) {
    baseConfig.byMonthDay = dayjs(startDate).get("date");
  }

  return baseConfig;
}

export function createDefaultWeeklySchedule(startDate: Date): ScheduleConfig {
  return createDefaultSchedule(startDate, PaymentFrequency.WEEKLY);
}

export function createDefaultDailySchedule(startDate: Date): ScheduleConfig {
  return createDefaultSchedule(startDate, PaymentFrequency.DAILY);
}

export function createDefaultMonthlySchedule(startDate: Date): ScheduleConfig {
  return createDefaultSchedule(startDate, PaymentFrequency.MONTHLY);
}
