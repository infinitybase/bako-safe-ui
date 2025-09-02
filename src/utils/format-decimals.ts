export const formatMinDecimals = (value: string, minDecimals: number) => {
  if (!value.includes('.')) {
    return `${value}.${'0'.repeat(minDecimals)}`;
  }

  const [integerPart, decimalPart] = value.split('.');

  const trimmedDecimal = decimalPart.replace(/0+$/, '');
  const finalDecimal = trimmedDecimal.padEnd(minDecimals, '0');

  return `${integerPart}.${finalDecimal}`;
};

export const formatMaxDecimals = (value: string, maxDecimals: number) => {
  if (!value.includes('.')) {
    return value;
  }

  const [integerPart, decimalPart] = value.split('.');

  const trimmedDecimal = decimalPart.slice(0, maxDecimals);

  return trimmedDecimal ? `${integerPart}.${trimmedDecimal}` : integerPart;
};
