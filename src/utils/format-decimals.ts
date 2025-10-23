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

/**
 * Rounds a number **always up** (ceil) to the specified number of decimal places.
 *
 * @param num - The number to be rounded
 * @param decimals - Number of decimal places (default is 6)
 * @returns The number rounded up
 *
 * @example
 * ceilToDecimals(0.1234501, 6); // returns 0.123451
 * ceilToDecimals(1.234001, 3);  // returns 1.235
 */
export const ceilToDecimals = (num: number, decimals: number = 6): number => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
};

/**
 * Rounds a number **always down** (floor) to the specified number of decimal places.
 *
 * @param num - The number to be rounded
 * @param decimals - Number of decimal places (default is 6)
 * @returns The number rounded down
 *
 * @example
 * floorToDecimals(0.1234567, 6); // returns 0.123456
 * floorToDecimals(1.234567, 3);  // returns 1.234
 */
export const floorToDecimals = (num: number, decimals: number = 6): number => {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};
