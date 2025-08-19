export const moneyFormat = (value: string, currency = 'USD'): string => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value.replace(/,/g, '')));
};
