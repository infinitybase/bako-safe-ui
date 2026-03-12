import { useCallback, useState } from 'react';

const useTransactionAccordion = () => {
  const [accordionIndex, setAccordionIndex] = useState(0);

  const close = useCallback(() => setAccordionIndex(-1), []);

  const open = useCallback((index: number) => setAccordionIndex(index), []);

  const reset = useCallback(() => setAccordionIndex(0), []);

  return {
    open,
    close,
    reset,
    index: accordionIndex,
  };
};

export { useTransactionAccordion };
