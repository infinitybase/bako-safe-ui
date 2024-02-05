import { Icon } from '@chakra-ui/icons';
import { Avatar, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { HandbagIcon } from '@/components/icons/handbag';
import { PredicateAndWorkspace } from '@/modules/vault/services/methods';

interface TransactionVaultInfoProps {
  vault: PredicateAndWorkspace;
}

const VaultInfo = ({ vault }: TransactionVaultInfoProps) => {
  return (
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
        {!vault.workspace.single && (
          <HStack>
            <Icon as={HandbagIcon} fontSize={14} color="grey.200" />
            <Text maxW={40} color="grey.200" fontSize="sm" isTruncated>
              {vault.workspace?.name}
            </Text>
          </HStack>
        )}
        <Heading
          maxW={180}
          variant="title-md"
          color="grey.200"
          mt={0}
          isTruncated
        >
          {vault.name}
        </Heading>
      </VStack>
    </HStack>
  );
};

export { VaultInfo };
