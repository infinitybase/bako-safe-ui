const limitName = (name: string) => {
  if (name.includes(' ')) return name;

  const maxLength = () => {
    const { innerWidth } = window;

    if (innerWidth >= 1880) return 30;
    if (innerWidth >= 1700) return 25;
    if (innerWidth >= 1450) return 18;

    return 12;
  };

  return name.length > maxLength()
    ? name.substring(0, maxLength()) + '...'
    : name;
};

export { limitName };
