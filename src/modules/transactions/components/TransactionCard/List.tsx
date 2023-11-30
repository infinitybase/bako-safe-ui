import { Accordion, StackProps, VStack } from '@chakra-ui/react';

interface TransactionCardListProps extends StackProps {
  openIndex?: number[];
}

const List = ({ children, openIndex, ...props }: TransactionCardListProps) => {
  return (
    <VStack
      w="full"
      as={Accordion}
      alignItems="flex-start"
      defaultIndex={openIndex ?? []}
      allowMultiple
      {...props}
    >
      {children}
    </VStack>
  );
};

export { List };
