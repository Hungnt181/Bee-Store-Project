export const formatCurrency = (amount: number, currency: string, lastString: string): string => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Không hiển thị phần thập phân nếu không cần
  }) + ` ${lastString}`;
};