/***
 TODO: Remove this and use AddressUtils.format.
 ***/
const limitCharacters = (
  text: string,
  limit: number,
  addEllipsis: boolean = true,
) => {
  if (text.length > limit) {
    return addEllipsis ? text.slice(0, limit) + '...' : text.slice(0, limit);
  }

  return text;
};

export { limitCharacters };
