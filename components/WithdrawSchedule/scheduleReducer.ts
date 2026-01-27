import { PaymentFrequency, ScheduleConfig } from "@/types/schema";
import { createDefaultSchedule } from "@/components/WithdrawSchedule/utils/defaults";
import dayjs from "dayjs";
import {
  validateScheduleConfig,
  getMaxIntervalForFrequency,
  jsWeekdayToRRule,
  calculateLastPayDay,
} from "./utils";

export type ScheduleAction =
  | { type: "SET_FREQUENCY"; freq: PaymentFrequency }
  | { type: "SET_INTERVAL"; interval: number }
  | { type: "TOGGLE_WEEKDAY"; dayIndex: number }
  | { type: "SET_WEEKDAYS"; weekdays: number[] }
  | { type: "SET_MONTH_DAY"; day: number }
  | { type: "SET_START_DATE"; date: number }
  | { type: "SET_END_DATE"; date: number }
  | { type: "RESET"; startDate?: Date };

export interface ScheduleState {
  schedule: ScheduleConfig;
  balance: number;
  amountPerPayDay: number;
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

export function createInitialState(
  startDate: Date = new Date(),
): ScheduleState {
  const schedule = createDefaultSchedule(startDate, PaymentFrequency.WEEKLY);
  const newLastPayDay = calculateLastPayDay(schedule, 100_000, 1_000_000, true);
  return {
    schedule: { ...schedule, until: newLastPayDay.getTime() },
    balance: 1_000_000,
    amountPerPayDay: 100_000,
    validation: validateScheduleConfig(schedule),
  };
}

function updateStateWithValidation(state: ScheduleState): ScheduleState {
  const newLastPayDay = calculateLastPayDay(
    state.schedule,
    state.amountPerPayDay,
    state.balance,
    true,
  );
  const newSchedule: ScheduleConfig = {
    ...state.schedule,
    until: newLastPayDay.getTime(),
  };
  console.log("new Schedule ", newSchedule);
  return {
    ...state,
    schedule: newSchedule,
    validation: validateScheduleConfig(newSchedule),
  };
}

function getDefaultEndDate(startDate: number, freq: PaymentFrequency): number {
  const start = dayjs(startDate);
  switch (freq) {
    case PaymentFrequency.DAILY:
      return start.add(30, "days").valueOf();
    case PaymentFrequency.WEEKLY:
      return start.add(4, "weeks").valueOf();
    case PaymentFrequency.MONTHLY:
      return start.add(3, "months").valueOf();
    default:
      return start.add(1, "month").valueOf();
  }
}

export function scheduleReducer(
  state: ScheduleState,
  action: ScheduleAction,
): ScheduleState {
  const { schedule } = state;

  switch (action.type) {
    case "SET_FREQUENCY": {
      const newFreq = action.freq;
      const maxInterval = getMaxIntervalForFrequency(newFreq);

      const newSchedule: ScheduleConfig = {
        ...schedule,
        freq: newFreq,
        interval: Math.min(schedule.interval, maxInterval),
      };
      delete newSchedule.byMonthDay;
      delete newSchedule.byWeekday;

      // Set defaults for frequency-specific fields
      if (newFreq === PaymentFrequency.WEEKLY) {
        // Default to the weekday of the start date
        const jsDay = dayjs(schedule.dtStart).get("day");
        const rruleDay = jsWeekdayToRRule(jsDay);
        newSchedule.byWeekday = [{ weekday: rruleDay }];
      }

      if (newFreq === PaymentFrequency.MONTHLY) {
        newSchedule.byMonthDay = dayjs(schedule.dtStart).get("date");
      }

      return updateStateWithValidation({ ...state, schedule: newSchedule });
    }

    case "SET_INTERVAL": {
      const maxInterval = getMaxIntervalForFrequency(schedule.freq);
      const clampedInterval = Math.max(
        1,
        Math.min(action.interval, maxInterval),
      );

      return updateStateWithValidation({
        ...state,
        schedule: {
          ...schedule,
          interval: clampedInterval,
        },
      });
    }

    case "TOGGLE_WEEKDAY": {
      const currentWeekdays = schedule.byWeekday ?? [];
      const dayIndex = action.dayIndex;
      const isCurrentlySelected = currentWeekdays.some(
        (wd) => wd.weekday === dayIndex,
      );

      let newWeekdays;
      if (isCurrentlySelected) {
        if (currentWeekdays.length <= 1) {
          // Return current state unchanged - can't remove last weekday
          return state;
        }
        newWeekdays = currentWeekdays.filter((wd) => wd.weekday !== dayIndex);
      } else {
        newWeekdays = [...currentWeekdays, { weekday: dayIndex }];
      }

      newWeekdays.sort((a, b) => a.weekday - b.weekday);
      return updateStateWithValidation({
        ...state,
        schedule: {
          ...schedule,
          byWeekday: newWeekdays,
        },
      });
    }

    case "SET_MONTH_DAY": {
      const day = Math.max(1, Math.min(31, action.day));

      return updateStateWithValidation({
        ...state,
        schedule: {
          ...schedule,
          byMonthDay: day,
        },
      });
    }

    case "SET_START_DATE": {
      const newStartDate = action.date;
      let newEndDate = schedule.until;

      // If new start date is after or equal to end date, auto-adjust end date
      if (newStartDate >= schedule.until) {
        newEndDate = getDefaultEndDate(newStartDate, schedule.freq);
      }

      // Update weekday if weekly (to match new start date's weekday)
      let newByWeekday = schedule.byWeekday;
      if (
        schedule.freq === PaymentFrequency.WEEKLY &&
        schedule.byWeekday?.length === 1
      ) {
        const jsDay = dayjs(newStartDate).get("day");
        const rruleDay = jsWeekdayToRRule(jsDay);
        newByWeekday = [{ weekday: rruleDay }];
      }

      // Update month day if monthly (to match new start date's day)
      let newByMonthDay = schedule.byMonthDay;
      if (schedule.freq === PaymentFrequency.MONTHLY) {
        newByMonthDay = dayjs(newStartDate).get("date");
      }

      return updateStateWithValidation({
        ...state,
        schedule: {
          ...schedule,
          dtStart: newStartDate,
          until: newEndDate,
          byWeekday: newByWeekday,
          byMonthDay: newByMonthDay,
        },
      });
    }

    case "SET_END_DATE": {
      const newEndDate = action.date;

      // Validate end date is after start date
      if (newEndDate <= schedule.dtStart) {
        // Set end date to minimum valid value (start date + 1 day)
        const minEndDate = dayjs(schedule.dtStart).add(1, "day").valueOf();
        return updateStateWithValidation({
          ...state,
          schedule: {
            ...schedule,
            until: minEndDate,
          },
        });
      }

      return updateStateWithValidation({
        ...state,
        schedule: {
          ...schedule,
          until: newEndDate,
        },
      });
    }

    case "RESET": {
      return createInitialState(action.startDate ?? new Date());
    }

    default:
      return state;
  }
}

export const scheduleActions = {
  setFrequency: (freq: PaymentFrequency): ScheduleAction => ({
    type: "SET_FREQUENCY",
    freq,
  }),

  setInterval: (interval: number): ScheduleAction => ({
    type: "SET_INTERVAL",
    interval,
  }),

  toggleWeekday: (dayIndex: number): ScheduleAction => ({
    type: "TOGGLE_WEEKDAY",
    dayIndex,
  }),

  setMonthDay: (day: number): ScheduleAction => ({
    type: "SET_MONTH_DAY",
    day,
  }),

  setStartDate: (date: number): ScheduleAction => ({
    type: "SET_START_DATE",
    date,
  }),

  setEndDate: (date: number): ScheduleAction => ({
    type: "SET_END_DATE",
    date,
  }),

  reset: (startDate?: Date): ScheduleAction => ({
    type: "RESET",
    startDate,
  }),
};
