import { Icon as ChackraIcon, Flex } from 'bako-ui';
import { memo, useMemo } from 'react';

import { useVerifyTransactionInformations } from '../../hooks';
import { TransactionWithVault } from '../../services';
import { getTransactionIconComponent } from '../../utils';

export const Icon = memo(
  ({ transaction }: { transaction: TransactionWithVault }) => {
    const {
      isFromConnector,
      isFromCLI,
      isDeploy,
      isDeposit,
      isSwap,
      isLiquidStake,
    } = useVerifyTransactionInformations(transaction);

    const IconComponent = useMemo(
      () =>
        getTransactionIconComponent({
          isDeploy,
          isFromConnector,
          isFromCLI,
          isDeposit,
          isSwap,
          isLiquidStake,
        }),
      [isDeploy, isFromConnector, isFromCLI, isDeposit, isSwap, isLiquidStake],
    );

    const size = useMemo(
      () =>
        isDeploy || isFromConnector || isSwap || isLiquidStake
          ? '16px'
          : '12px',
      [isDeploy, isFromConnector, isSwap, isLiquidStake],
    );

    return (
      <Flex
        alignItems="flex-start"
        justifyContent="center"
        bgColor="gray.600"
        minW="32px"
        p={0}
        borderRadius="10px 0 0 10px"
        h="auto"
      >
        <ChackraIcon as={IconComponent} mt={8} boxSize={size} />
      </Flex>
    );
  },
);

Icon.displayName = 'Transaction Icon';
