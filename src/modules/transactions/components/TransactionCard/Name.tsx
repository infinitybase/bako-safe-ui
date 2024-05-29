import { Center, Heading, HStack, Text } from '@chakra-ui/react';

import { useScreenSize } from '@/modules/core/hooks';

interface TransactionCardNameProps {
  vaultName: string;
  showTransaction?: boolean;
}

const Name = ({
  vaultName,
  showTransaction = true,
}: TransactionCardNameProps) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <Center alignItems="flex-start" flexDir="column" width="80%">
        <HStack w="100%">
          <Heading
            variant={isMobile ? 'title-sm' : 'title-md'}
            color="grey.200"
            textOverflow="ellipsis"
            textAlign="left"
            noOfLines={1}
          >
            <Text
              w="100%"
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {vaultName}
            </Text>
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
  }

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
          {vaultName}
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
