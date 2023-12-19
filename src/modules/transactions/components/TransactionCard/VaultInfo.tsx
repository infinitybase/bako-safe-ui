import { Avatar, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { Predicate } from '@/modules/core';

interface TransactionVaultInfoProps {
  vault: Predicate;
}

const VaultInfo = ({ vault }: TransactionVaultInfoProps) => (
  <HStack w={235}>
    <Avatar
      variant="roundedSquare"
      name={vault.name}
      color="white"
      bg="grey.900"
      w="38px"
      h="38px"
      p={5}
      fontSize="sm"
    />
    <VStack ml={1} alignItems="flex-start" spacing={0}>
      <Heading
        maxW={180}
        variant="title-md"
        color="grey.200"
        mt={0}
        isTruncated
      >
        {vault.name}
      </Heading>
      {vault?.description && (
        <Text
          maxW={180}
          variant="description"
          fontSize="sm"
          color="grey.500"
          isTruncated
        >
          {vault.description}
        </Text>
      )}
    </VStack>
  </HStack>
);

export { VaultInfo };
