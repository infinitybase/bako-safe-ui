import { BoxProps, Text, VStack } from '@chakra-ui/react';

import { PredicateAndWorkspace } from '@/modules/vault/services/methods';

interface TransactionBasicInfosProps extends BoxProps {
  vault: PredicateAndWorkspace;
  transactionName: string;
}

const BasicInfos = ({
  vault,
  transactionName,
  ...rest
}: TransactionBasicInfosProps) => {
  return (
    <VStack alignItems="flex-start" spacing={0} w={180} {...rest}>
      <Text maxW={122} color="grey.75" mt={0} isTruncated fontSize="sm" mb={2}>
        {transactionName}
      </Text>
      <Text maxW={106} color="grey.425" mt={0} isTruncated fontSize="xs">
        {vault.name}
      </Text>

      {/* Commented out code to temporarily disable workspaces. */}

      {/* {!vault.workspace.single && (
        <HStack spacing={1}>
          <Icon
            as={HandbagIcon}
            fontSize={{ base: 'xs', sm: 14 }}
            color="grey.200"
          />
          <Text
            textAlign="start"
            w={88}
            color="grey.200"
            fontSize="xs"
            isTruncated
          >
            {vault.workspace?.name}
          </Text>
        </HStack>
      )} */}
    </VStack>
  );
};

export { BasicInfos };
