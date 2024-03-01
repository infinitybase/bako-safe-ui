import { Center, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardCreationDateProps {
  children: ReactNode;
}

const CreationDate = ({ children }: TransactionCardCreationDateProps) => {
  return (
    <Center
      w={{ base: 'full', sm: 100 }}
      justifyContent={{ base: 'flex-end', sm: 'flex-start' }}
    >
      <Text variant="subtitle" fontWeight="semibold" color="grey.200">
        {children}
      </Text>
    </Center>
  );
};

export { CreationDate };
