export const emptyCallback = () => {};

export const delay = (callback: () => void, ms: number) =>
  setTimeout(callback, ms);
