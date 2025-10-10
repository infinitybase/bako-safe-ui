import { useState } from 'react';

export const useDisclosure = (defaultValue = false) => {
  const [open, setOpen] = useState(defaultValue);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((prev) => !prev);
  const onOpenChange = ({ open }: { open: boolean }) => setOpen(open);

  return { isOpen: open, onOpen, onClose, onToggle, onOpenChange, setOpen };
};

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;
