export const isNumericString = (value: string): boolean => {
  return value.trim() !== '' && !isNaN(Number(value));
};
