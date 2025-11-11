import { BoxProps, StackProps, Text, VStack } from 'bako-ui';

import { PredicateAndWorkspace } from '@/modules/vault/services/methods';
import { limitCharacters } from '@/utils';

interface TransactionBasicInfosProps extends StackProps {
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
    <VStack alignItems="flex-start" gap={0} {...rest} w="full">
      <Text
        color="textSecondary"
        mt={0}
        fontSize="xs"
        wordBreak="break-all"
        lineClamp={1}
        {...nameSxProps}
        mb={spacingBetweenNameAndDesc ? 2 : 0}
      >
        {limitCharacters(transactionName, 28)}
      </Text>
      <Text
        color="gray.400"
        mt={0}
        wordBreak="break-all"
        lineClamp={1}
        fontSize="xs"
        {...descSxProps}
      >
        {vault.name}
      </Text>

      {/* Commented out code to temporarily disable workspaces. */}

      {/* {!vault.workspace.single && (
        <HStack gap={1}>
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
