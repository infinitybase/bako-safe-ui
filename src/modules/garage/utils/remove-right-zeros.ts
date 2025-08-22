export const removeRightZeros = (num: string) => {
  const parts = num.split('.');
  if (parts.length === 2) {
    parts[1] = parts[1].replace(/0+$/, '');
    if (parts[1] === '') {
      return parts[0]; // Return only the integer part if decimal part is empty
    }
    return parts.join('.');
  }
  return num; // Return the original number if no decimal part
};
