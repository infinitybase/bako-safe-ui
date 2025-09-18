import { useCallback, useState } from 'react';

/**
 * Hook para gerenciar o estado do accordion de transações
 * Separado para reutilização e melhor organização
 */
const useTransactionAccordion = () => {
  const [accordionIndex, setAccordionIndex] = useState(0);

  const close = useCallback(() => setAccordionIndex(-1), []);

  const open = useCallback((index: number) => setAccordionIndex(index), []);

  return {
    open,
    close,
    index: accordionIndex,
  };
};

export { useTransactionAccordion };
