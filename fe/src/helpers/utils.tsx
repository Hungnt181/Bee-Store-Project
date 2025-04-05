export const formatCurrency = (amount: number, currency: string): string => {
  const originCurr = amount.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).replace(/[^\d,]/g, "");

  return originCurr + ` VNĐ`;
};