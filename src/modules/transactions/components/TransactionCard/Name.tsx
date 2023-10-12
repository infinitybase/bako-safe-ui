import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardNameProps {
  children: ReactNode;
}

const Name = ({ children }: TransactionCardNameProps) => (
  <HStack w={200} ml={0} textAlign="left">
    <Box>
      <Heading variant="title-md" color="grey.200">
        {children}
      </Heading>
      <Text variant="description" fontSize="sm" color="grey.500">
        Transaction
      </Text>
    </Box>
  </HStack>
);

export { Name };
