import { Center, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardCreationDateProps {
  children: ReactNode;
}

const CreationDate = ({ children }: TransactionCardCreationDateProps) => {
  return (
    <Center justifyContent="flex-start">
      <Text variant="subtitle" fontWeight="semibold" color="grey.200">
        {children}
      </Text>
    </Center>
  );
};

export { CreationDate };
