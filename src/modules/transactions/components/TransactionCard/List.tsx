import { Accordion, StackProps, VStack } from '@chakra-ui/react';

interface TransactionCardListProps extends StackProps {}

const List = ({ children, ...props }: TransactionCardListProps) => (
  <VStack
    w="full"
    as={Accordion}
    alignItems="flex-start"
    allowMultiple
    {...props}
  >
    {children}
  </VStack>
);

export { List };
