export const moneyFormat = (value: string, currency = 'USD'): string => {
  const replacedValue =
    currency === 'BRL' ? replaceBRLThousandSeparator(value) : value;
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(replacedValue));
};

export const replaceBRLThousandSeparator = (value: string): string => {
  return value.replace(/\./g, '').replace(/,/g, '.');
};
