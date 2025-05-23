import { Flex, Icon as ChackraIcon } from '@chakra-ui/react';
import { memo, useMemo } from 'react';

import { useVerifyTransactionInformations } from '../../hooks';
import { TransactionWithVault } from '../../services';
import { getTransactionIconComponent } from '../../utils';

export const Icon = memo(
  ({ transaction }: { transaction: TransactionWithVault }) => {
    const { isFromConnector, isFromCLI, isDeploy, isDeposit } =
      useVerifyTransactionInformations(transaction);

    const IconComponent = useMemo(
      () =>
        getTransactionIconComponent({
          isDeploy,
          isFromConnector,
          isFromCLI,
          isDeposit,
        }),
      [isDeploy, isFromConnector, isFromCLI, isDeposit],
    );

    return (
      <Flex
        alignItems="flex-start"
        justifyContent="center"
        bgColor="grey.925"
        minW="32px"
        p={0}
        borderRadius="10px 0 0 10px"
        h="auto"
      >
        <ChackraIcon
          as={IconComponent}
          mt={8}
          fontSize={isDeploy || isFromConnector ? 'inherit' : '12px'}
        />
      </Flex>
    );
  },
);

Icon.displayName = 'Transaction Icon';
