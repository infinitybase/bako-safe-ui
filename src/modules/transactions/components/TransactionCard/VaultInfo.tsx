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

  if (isMobile) {
    return (
      <HStack w="80%">
        <Avatar
          variant="roundedSquare"
          name={vault.name}
          color="white"
          bg="grey.600"
          w={50}
          h={50}
        />
        <VStack ml={1} alignItems="flex-start" spacing={0} w="90%">
          {!vault.workspace.single && (
            <HStack w="100%">
              <Icon
                as={HandbagIcon}
                fontSize={{ base: 'xs', sm: 14 }}
                color="grey.200"
              />
              <Text
                color="grey.200"
                fontSize={{ base: 'sm', sm: 'xs', md: 'md' }}
                w="80%"
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {vault.workspace?.name}
              </Text>
            </HStack>
          )}
          <Heading
            w="80%"
            variant={isMobile ? 'title-sm' : 'title-md'}
            color="grey.200"
            mt={0}
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {vault.name}
          </Heading>
        </VStack>
      </HStack>
    );
  }

  return (
    <HStack w={250}>
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
              //maxW="80%"
              w={{ base: 100, sm: '100%', md: 140, mxs: 200 }}
              color="grey.200"
              fontSize={{ base: 'sm', sm: 'xs', md: 'md' }}
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
