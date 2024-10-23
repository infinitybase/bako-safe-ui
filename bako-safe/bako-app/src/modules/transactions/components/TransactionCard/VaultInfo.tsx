import { BoxProps, Text, VStack } from '@chakra-ui/react';

import { PredicateAndWorkspace } from '@/modules/vault/services/methods';
import { limitCharacters } from '@/utils';

interface TransactionBasicInfosProps extends BoxProps {
  vault: PredicateAndWorkspace;
  transactionName: string;
  spacingBetweenNameAndDesc?: boolean;
  nameSxProps?: BoxProps;
  descSxProps?: BoxProps;
}

const BasicInfos = ({
  vault,
  transactionName,
  spacingBetweenNameAndDesc = true,
  nameSxProps,
  descSxProps,
  ...rest
}: TransactionBasicInfosProps) => {
  return (
    <VStack alignItems="flex-start" spacing={0} {...rest} w="full">
      <Text
        color="grey.75"
        mt={0}
        fontSize="sm"
        wordBreak="break-all"
        noOfLines={1}
        {...nameSxProps}
        mb={spacingBetweenNameAndDesc ? 2 : 0}
      >
        {limitCharacters(transactionName, 28)}
      </Text>
      <Text
        color="grey.425"
        mt={0}
        wordBreak="break-all"
        noOfLines={1}
        fontSize="xs"
        {...descSxProps}
      >
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
