import { Accordion, AccordionRootProps } from '@chakra-ui/react';
import { useMemo } from 'react';

interface TransactionCardListProps extends AccordionRootProps {
  openIndex?: number[];
}

const List = ({ children, openIndex, ...props }: TransactionCardListProps) => {
  const value = useMemo(() => openIndex?.map(String) || [], [openIndex]);
  return (
    <Accordion.Root
      w="full"
      alignItems="flex-start"
      multiple
      defaultValue={value}
      {...props}
    >
      {children}
    </Accordion.Root>
  );
};

export { List };
