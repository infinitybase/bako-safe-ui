export const shortenHexString = (hexString: string) => {
  const maxCharacters = 12;

  if (hexString.length <= maxCharacters) {
    return hexString;
  }

  const start = hexString.substring(0, maxCharacters);
  const end = hexString.substring(hexString.length - 3);

  return `${start}...${end}`;
};
