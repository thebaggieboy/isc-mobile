export function formatMoney(amount: number): string {
  const amountStr = amount
    .toLocaleString("en-US", { style: "currency", currency: "NGN" })
    .split("NGN")[1];

  return amountStr.split(".")[0].trim();
}

export function parseMoney(amount: string): string | undefined {
  if (!amount) {
    return undefined;
  }
  const amountClean = amount.replace(/[^0-9]/g, "");
  const numberOnlyRegex = /^\d+$/;
  if (!numberOnlyRegex.test(amountClean)) {
    return undefined;
  }
  const amountNumber = parseInt(amountClean);
  return formatMoney(amountNumber);
}
