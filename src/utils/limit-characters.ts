/***
 TODO: Remove this and use AddressUtils.format.
 ***/
const limitCharacters = (
  text: string,
  limit: number,
  showEllipsis: boolean = true,
) => {
  if (text.length > limit) {
    return showEllipsis ? text.slice(0, limit) + '...' : text.slice(0, limit);
  }

  return text;
};

export { limitCharacters };
