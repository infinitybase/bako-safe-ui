const sanitizeInput = (value: string) => {
  return value
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/["']/g, '')
    .trim();
};

export { sanitizeInput };