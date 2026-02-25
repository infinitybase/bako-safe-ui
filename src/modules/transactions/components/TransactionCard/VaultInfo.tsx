import { BoxProps, StackProps, Text, VStack } from 'bako-ui';

import { PredicateAndWorkspace } from '@/modules/vault/services/methods';
import { limitCharacters } from '@/utils';

interface TransactionBasicInfosProps extends StackProps {
  vault: PredicateAndWorkspace;
  transactionName: string;
  nameSxProps?: BoxProps;
  descSxProps?: BoxProps;
}

const BasicInfos = ({
  vault,
  transactionName,
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
        lineHeight="22.5px"
        {...nameSxProps}
      >
        {limitCharacters(transactionName, 28)}
      </Text>
      <Text
        color="gray.400"
        mt={0}
        wordBreak="break-all"
        lineClamp={1}
        fontSize="xs"
        lineHeight="22.5px"
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
