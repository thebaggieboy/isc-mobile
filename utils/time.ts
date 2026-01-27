/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateToViewable(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Gets the number of days in a specific month
 * @param year - The year
 * @param month - The month (0-indexed, 0 = January)
 * @returns Number of days in the month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets the number of days in the current month
 * @returns Number of days in the current month
 */
export function getDaysForCurrentMonth(): number {
  const now = new Date();
  return getDaysInMonth(now.getFullYear(), now.getMonth());
}

/**
 * Gets the number of days in the month of a given date
 * @param date - The date to get the month's days from
 * @returns Number of days in that month
 */
export function getDaysForMonth(date: Date): number {
  return getDaysInMonth(date.getFullYear(), date.getMonth());
}

