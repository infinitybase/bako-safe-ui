const isHex = (value: string) => {
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return typeof value === 'string' && hexRegex.test(value);
};

export { isHex };
