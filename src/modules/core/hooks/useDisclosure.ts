import { useCallback, useState } from 'react';

export const useDisclosure = (defaultValue = false) => {
  const [open, setOpen] = useState(defaultValue);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((prev) => !prev), []);
  const onOpenChange = useCallback(
    ({ open }: { open: boolean }) => setOpen(open),
    [],
  );

  return { isOpen: open, onOpen, onClose, onToggle, onOpenChange, setOpen };
};

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;
