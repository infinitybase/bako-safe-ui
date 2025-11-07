const scrollToBottom = (containerRef: React.RefObject<HTMLElement | null>) => {
  const container = containerRef.current;

  if (container) {
    container.scroll({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
};

export { scrollToBottom };
