export const formatMinDecimals = (value: string, minDecimals: number) => {
  if (!value.includes('.')) {
    return `${value}.${'0'.repeat(minDecimals)}`;
  }

  const [integerPart, decimalPart] = value.split('.');

  const trimmedDecimal = decimalPart.replace(/0+$/, '');
  const finalDecimal = trimmedDecimal.padEnd(minDecimals, '0');

  return `${integerPart}.${finalDecimal}`;
};
