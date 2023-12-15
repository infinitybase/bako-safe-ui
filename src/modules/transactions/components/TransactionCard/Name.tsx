import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TransactionCardNameProps {
  children: ReactNode;
}

const Name = ({ children }: TransactionCardNameProps) => (
  <Center alignItems="flex-start" flexDir="column" w="full">
    <Box maxW={200}>
      <Heading
        variant="title-md"
        color="grey.200"
        textOverflow="ellipsis"
        noOfLines={1}
      >
        {children}
      </Heading>
    </Box>
    <Text variant="description" fontSize="sm" color="grey.500">
      Transaction
    </Text>
  </Center>
);

export { Name };
