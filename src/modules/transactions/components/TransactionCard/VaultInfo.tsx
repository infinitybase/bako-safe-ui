import { Avatar, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { Predicate } from '@/modules/core';
import { limitCharacters } from '@/utils';

interface TransactionVaultInfoProps {
  vault: Predicate;
}

const VaultInfo = ({ vault }: TransactionVaultInfoProps) => (
  <HStack w={240}>
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
      <Heading variant="title-md" color="grey.200" mt={0}>
        {limitCharacters(vault.name, 20)}
      </Heading>
      {vault?.description && (
        <Text variant="description" fontSize="sm" color="grey.500">
          {limitCharacters(vault.description, 24)}
        </Text>
      )}
    </VStack>
  </HStack>
);

export { VaultInfo };
