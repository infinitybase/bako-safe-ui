export const abbreviationNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  const TRILLION = 1_000_000_000_000;
  const BILLION = 1_000_000_000;
  const MILLION = 1_000_000;

  if (num >= TRILLION) {
    return `${Math.floor(num / TRILLION)} tri`;
  }

  if (num >= BILLION) {
    return `${Math.floor(num / BILLION)} bi`;
  }

  if (num >= MILLION) {
    return `${Math.floor(num / MILLION)} mi`;
  } else if (num >= 1_000) {
    return `${Math.floor(num / 1_000)}k`;
  } else {
    return `${num}`;
  }
};
