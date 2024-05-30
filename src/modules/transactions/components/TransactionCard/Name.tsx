import { Center, Heading, HStack, Text } from '@chakra-ui/react';

import { useScreenSize } from '@/modules/core/hooks';
import { limitCharacters } from '@/utils';

interface TransactionCardNameProps {
  showTransaction?: boolean;
  transactionName?: string;
}

const Name = ({
  showTransaction = true,
  transactionName,
}: TransactionCardNameProps) => {
  const { isMobile } = useScreenSize();

  return (
    <Center
      w="fit-content"
      alignItems="flex-start"
      flexDir="column"
      gridRow={isMobile ? 2 : 0}
    >
      <HStack maxW={200}>
        <Heading
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.200"
          textOverflow="ellipsis"
          textAlign="left"
          noOfLines={1}
        >
          {limitCharacters(String(transactionName) ?? '', 8)}
        </Heading>
      </HStack>
      {showTransaction && (
        <Text
          variant="description"
          textAlign="left"
          fontSize={{ base: 'xs', sm: 'sm' }}
          color="grey.500"
        >
          Transaction
        </Text>
      )}
    </Center>
  );
};

export { Name };
