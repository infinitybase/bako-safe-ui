import { Center, Heading, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useScreenSize } from '@/modules/core/hooks';

interface TransactionCardNameProps {
  children: ReactNode;
}

const Name = ({ children }: TransactionCardNameProps) => {
  const { isMobile } = useScreenSize();

  return (
    <Center alignItems="flex-start" flexDir="column" w="full">
      <HStack maxW={200}>
        <Heading
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.200"
          textOverflow="ellipsis"
          textAlign="left"
          noOfLines={1}
        >
          {children}
        </Heading>
      </HStack>
      <Text
        variant="description"
        textAlign="left"
        fontSize={{ base: 'xs', sm: 'sm' }}
        color="grey.500"
      >
        Transaction
      </Text>
    </Center>
  );
};

export { Name };
