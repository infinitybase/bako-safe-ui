import { Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardCreationDateProps {
  children: ReactNode;
}

const CreationDate = ({ children }: TransactionCardCreationDateProps) => {
  return (
    <Box w={90}>
      <Text variant="subtitle" fontWeight="semibold" color="grey.200" ml={-2}>
        {children}
      </Text>
    </Box>
  );
};

export { CreationDate };
