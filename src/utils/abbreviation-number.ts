export const abbreviationNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  const TRILLION = 1_000_000_000_000;
  const BILLION = 1_000_000_000;
  const MILLION = 1_000_000;

  if (num >= TRILLION) {
    return `${Math.floor(num / TRILLION)} tri`;
  }

  if (num >= BILLION) {
    return `${Math.floor(num / BILLION)} bi`;
  }

  return `${Math.floor(num / MILLION)} mi`;
};
