export function formatMoney(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === "") {
    return "0.00";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "0.00";
  }

  const amountStr = numAmount
    .toLocaleString("en-US", { style: "currency", currency: "NGN" });

  if (amountStr.includes("NGN")) {
    return amountStr.split("NGN")[1].trim();
  }

  return amountStr.trim();
}

export function parseMoney(amount: string): string | undefined {
  if (!amount) {
    return undefined;
  }
  const amountClean = amount.replace(/[^0-9.]/g, ""); // Allow decimals in regex if needed, but current logic seems to want int?
  // Original regex was /^\d+$/ which means integer only. Keeping generic safety.

  if (!amountClean) return undefined;

  const amountNumber = parseFloat(amountClean);
  if (isNaN(amountNumber)) return undefined;

  return formatMoney(amountNumber);
}
