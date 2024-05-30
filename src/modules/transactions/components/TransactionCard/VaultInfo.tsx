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
    <HStack w={180}>
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
            <Icon
              as={HandbagIcon}
              fontSize={{ base: 'xs', sm: 14 }}
              color="grey.200"
            />
            <Text
              maxW={24}
              color="grey.200"
              fontSize={{ base: 'xs', sm: 'sm' }}
              isTruncated
            >
              {vault.workspace?.name}
            </Text>
          </HStack>
        )}
        <Heading
          maxW={{ base: 110, xs: 180, sm: 120 }}
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
