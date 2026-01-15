const sanitizeInput = (value: string) => {
  return value.trim().replace(/[<>"']/g, '');
};

export { sanitizeInput };