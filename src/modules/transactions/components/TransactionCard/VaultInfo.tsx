import { Icon } from '@chakra-ui/icons';
import { Avatar, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { HandbagIcon } from '@/components/icons/handbag';
import { useScreenSize } from '@/modules/core';
import { PredicateAndWorkspace } from '@/modules/vault/services/methods';

interface TransactionVaultInfoProps {
  vault: PredicateAndWorkspace;
}

const VaultInfo = ({ vault }: TransactionVaultInfoProps) => {
  const { isMobile } = useScreenSize();

  return (
    <HStack w={235}>
      <Avatar
        variant="roundedSquare"
        name={vault.name}
        color="white"
        bg="grey.600"
        size={{ base: 'sm', sm: 'md' }}
        maxW="40px"
        maxH="40px"
      />
      <VStack ml={1} alignItems="flex-start" spacing={0}>
        {!vault.workspace.single && (
          <HStack>
            <Icon as={HandbagIcon} fontSize={['xs', 14]} color="grey.200" />
            <Text
              maxW={40}
              color="grey.200"
              fontSize={['xs', 'sm']}
              isTruncated
            >
              {vault.workspace?.name}
            </Text>
          </HStack>
        )}
        <Heading
          maxW={180}
          variant={isMobile ? 'title-sm' : 'title-md'}
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
