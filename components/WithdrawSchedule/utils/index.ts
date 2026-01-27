import { ScheduleConfig, PaymentFrequency } from "@/types/schema";
import { RRule, Frequency, Weekday as WeekdayRR, Options } from "rrule";

const frequencyMap: Record<PaymentFrequency, Frequency> = {
  [PaymentFrequency.MONTHLY]: RRule.MONTHLY,
  [PaymentFrequency.WEEKLY]: RRule.WEEKLY,
  [PaymentFrequency.DAILY]: RRule.DAILY,
};

/**
 * RRule weekday array indexed by RRule convention (Monday=0, Sunday=6)
 */
const rruleWeekdays: WeekdayRR[] = [
  RRule.MO, // 0
  RRule.TU, // 1
  RRule.WE, // 2
  RRule.TH, // 3
  RRule.FR, // 4
  RRule.SA, // 5
  RRule.SU, // 6
];

/**
 * Converts JavaScript day index (Sunday=0) to RRule day index (Monday=0)
 * @param jsDay - JavaScript day index (0-6, where 0=Sunday)
 * @returns RRule day index (0-6, where 0=Monday)
 */
export function jsWeekdayToRRule(jsDay: number): number {
  return (jsDay + 6) % 7;
}

/**
 * Validates a ScheduleConfig object
 * @param scheduleConfig - The schedule configuration to validate
 * @returns Object containing isValid boolean and array of error messages
 */
export function validateScheduleConfig(scheduleConfig: ScheduleConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate date range
  if (scheduleConfig.until <= scheduleConfig.dtStart) {
    errors.push("End date must be after start date");
  }

  // Validate interval
  if (scheduleConfig.interval < 1) {
    errors.push("Interval must be at least 1");
  }

  // Validate weekly schedule has at least one weekday
  if (scheduleConfig.freq === PaymentFrequency.WEEKLY) {
    if (!scheduleConfig.byWeekday || scheduleConfig.byWeekday.length === 0) {
      errors.push("Weekly schedule must have at least one day selected");
    }
  }

  // Validate monthly schedule has a day set
  if (scheduleConfig.freq === PaymentFrequency.MONTHLY) {
    if (
      !scheduleConfig.byMonthDay ||
      scheduleConfig.byMonthDay < 1 ||
      scheduleConfig.byMonthDay > 31
    ) {
      errors.push("Monthly schedule must have a valid day (1-31)");
    }
  }

  // Validate weekday indices are in range
  if (scheduleConfig.byWeekday) {
    for (const wd of scheduleConfig.byWeekday) {
      if (wd.weekday < 0 || wd.weekday > 6) {
        errors.push(`Invalid weekday index: ${wd.weekday}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Converts a custom ScheduleConfig object to an RRule instance
 * Note: ScheduleConfig.byWeekday uses RRule convention (Monday=0, Sunday=6)
 * @param scheduleConfig - The custom schedule configuration object
 * @returns RRule instance representing the schedule
 */
export function scheduleConfigToRRule(scheduleConfig: ScheduleConfig): RRule {
  const rruleOptions: Partial<Options> = {
    freq: frequencyMap[scheduleConfig.freq],
    dtstart: new Date(scheduleConfig.dtStart),
    interval: scheduleConfig.interval,
  };

  if (scheduleConfig.until !== undefined) {
    rruleOptions.until = new Date(scheduleConfig.until);
  }

  // Add bymonthday for monthly schedules
  if (scheduleConfig.byMonthDay !== undefined) {
    rruleOptions.bymonthday = scheduleConfig.byMonthDay;
  }

  // Convert custom weekday format to RRule weekday format if present
  // ScheduleConfig.byWeekday already uses RRule convention (Monday=0)
  if (scheduleConfig.byWeekday && scheduleConfig.byWeekday.length > 0) {
    rruleOptions.byweekday = scheduleConfig.byWeekday.map((wd) => {
      const rruleWeekday = rruleWeekdays[wd.weekday];

      // If nth occurrence is specified (e.g., 2nd Monday), use nth method
      if (wd.n !== undefined) {
        return rruleWeekday.nth(wd.n);
      }

      return rruleWeekday;
    });
  }

  return new RRule(rruleOptions);
}

/**
 * Gets the maximum sensible interval for a given frequency
 * @param freq - The payment frequency
 * @returns Maximum interval value
 */
export function getMaxIntervalForFrequency(freq: PaymentFrequency): number {
  switch (freq) {
    case PaymentFrequency.DAILY:
      return 7;
    case PaymentFrequency.WEEKLY:
      return 4;
    case PaymentFrequency.MONTHLY:
      return 12;
    default:
      return 31;
  }
}

export function calculateLastPayDay(
  scheduleConfig: ScheduleConfig,
  payAmount: number,
  totalAmount: number,
  tillEnd?: boolean,
): Date {
  const rrule = scheduleConfigToRRule(scheduleConfig);
  if (tillEnd) {
    rrule.options.until = null;
    rrule.options.count = 100;
  }
  const dates = rrule.all();
  let lastPayDay = dates[dates.length - 1];
  let amountTotal = totalAmount;
  let paidCount = 0
  console.log(dates.map((d) => d.toLocaleDateString()));
  for (const date of dates) {
    console.log("current amount:", amountTotal.toLocaleString());
    if (amountTotal > payAmount) {
      paidCount++;
      console.log("subtracting paying amount:", payAmount.toLocaleString());
      amountTotal = amountTotal - payAmount;
      lastPayDay = date;
      console.log("new amount:", amountTotal.toLocaleString());
      console.log("new lastPayDay:", lastPayDay.toLocaleDateString());
      console.log("====================================");
      continue;
    }
    break;
  }
  console.log("====================================");
  console.log("final amount:", amountTotal.toLocaleString());
  console.log("final lastPayDay:", lastPayDay.toLocaleDateString());
  console.log("final paidCount:", paidCount);
  return lastPayDay;
}
