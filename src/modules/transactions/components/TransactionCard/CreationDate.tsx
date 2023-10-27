import { Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardCreationDateProps {
  children: ReactNode;
}

const CreationDate = ({ children }: TransactionCardCreationDateProps) => {
  return (
    <Flex w={110}>
      <Text variant="subtitle" fontWeight="semibold" color="grey.200">
        {children}
      </Text>
    </Flex>
  );
};

export { CreationDate };
