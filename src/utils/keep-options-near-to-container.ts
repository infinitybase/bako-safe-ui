type KeepOptionsNearToInputProps<T extends HTMLElement> = {
  containerRef: React.RefObject<T[]> | React.RefObject<T>;
  childRef: React.RefObject<T>;
  pixelsToIncrement?: number;
  index?: number;
};

const keepOptionsNearToInput = <T extends HTMLElement>({
  containerRef,
  childRef,
  pixelsToIncrement = 0,
  index = 0,
}: KeepOptionsNearToInputProps<T>): void => {
  if (containerRef.current && childRef.current) {
    const containerRect = containerRef.current[index].getBoundingClientRect();
    childRef.current.style.top = `${containerRect.top + pixelsToIncrement}px`;
    childRef.current.style.left = `${containerRect.left}px`;
  }
};

export { keepOptionsNearToInput };
