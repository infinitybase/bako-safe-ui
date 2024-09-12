import { Icon } from '@chakra-ui/icons';
import { Box, Center, HStack, StackProps, Text } from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';

import { AddressUtils, AssetModel } from '@/modules/core';
import { TransactionWithVault } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface ContractAddressesProps extends StackProps {
  asset?: AssetModel;
  transaction: TransactionWithVault;
  hasToken?: boolean;
}

const ContractAddresses = ({
  transaction,
  ...props
}: ContractAddressesProps) => {
  const mainOperation = transaction.summary?.operations[0];
  const {
    screenSizes: {
      isExtraSmall,
      isLowerThanFourHundredAndThirty,
      isMobile,
      isExtraLarge,
    },
  } = useWorkspaceContext();

  if (!mainOperation) {
    return null;
  }

  const { from, to } = mainOperation;

  return (
    <HStack
      py={2}
      spacing={{ base: 1, xs: 10 }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      <Box w="full">
        <Text
          w="full"
          fontSize="sm"
          color="grey.75"
          textOverflow="ellipsis"
          isTruncated
        >
          {AddressUtils.format(
            from?.address ?? '',
            isExtraSmall
              ? 5
              : isLowerThanFourHundredAndThirty
                ? 9
                : isMobile
                  ? 10
                  : isExtraLarge
                    ? 18
                    : 15,
          )}
        </Text>
      </Box>
      <Box display="flex" justifyContent="center" w="full">
        <Center
          borderRadius={5}
          bgColor="grey.825"
          borderWidth={1}
          borderColor="grey.925"
          boxSize="30px"
        >
          <Icon color="grey.250" fontSize="12px" as={FaPlay} />
        </Center>
      </Box>

      <Box w="full">
        <Text
          w="full"
          fontSize="sm"
          color="grey.75"
          textOverflow="ellipsis"
          isTruncated
          textAlign="end"
        >
          {AddressUtils.format(
            to?.address ?? '',
            isExtraSmall
              ? 5
              : isLowerThanFourHundredAndThirty
                ? 9
                : isMobile
                  ? 10
                  : isExtraLarge
                    ? 18
                    : 15,
          )}
        </Text>
      </Box>
    </HStack>
  );
};

export { ContractAddresses };
