import { Card, Flex, Heading, Icon, Loader, Stack, Text } from 'bako-ui';
import { TransactionCost } from 'fuels';
import { PoolId } from 'mira-dex-ts';
import { memo } from 'react';
import { FiAlertTriangle as WarningIcon } from 'react-icons/fi';

import { useSwapRate } from '../../hooks/swap/useSwapRate';
import { ExpandableCardSection } from '../bridge/ExpandableCardSection';
import { SwapMode, SwapState } from './Root';
import { SwapRouteItem } from './SwapRouteItem';

interface SwapReviewProps {
  txCost?: TransactionCost;
  isLoadingCost: boolean;
  swapState: SwapState;
  pools: PoolId[];
  mode: SwapMode;
  isCurrentStep: boolean;
  error?: string;
  children: React.ReactNode;
}

export const SwapReview = memo(function SwapReview({
  txCost,
  isLoadingCost,
  swapState,
  pools,
  mode,
  isCurrentStep,
  children,
  error,
}: SwapReviewProps) {
  const rate = useSwapRate({ swapState });

  const fee =
    swapState.fee && mode !== 'idle'
      ? `${swapState.fee?.formatUnits(9)} ${
          mode === 'buy' ? swapState.from.slug : swapState.to.slug
        }`
      : '-';

  const cost =
    txCost?.gasPrice && mode !== 'idle'
      ? `${txCost.gasPrice.formatUnits(9)} ETH`
      : '-';

  return (
    <Card.Root
      variant="subtle"
      rounded="2xl"
      w="full"
      bg="bg.panel"
      minH="88px"
      overflow="hidden"
    >
      <Card.Header pb={isCurrentStep ? 0 : 6}>
        <Heading
          color={isCurrentStep ? 'textPrimary' : 'gray.400'}
          fontSize="sm"
        >
          Resume
        </Heading>
      </Card.Header>
      <ExpandableCardSection isExpanded={isCurrentStep} type="body">
        {error && (
          <Flex alignItems="center" gap={2}>
            <Icon as={WarningIcon} boxSize="24px" color="red.500" />
            <Text color="red.500" fontSize="xs">
              {error}
            </Text>
          </Flex>
        )}

        {!error && (
          <Stack gap={1}>
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="gray.400" fontSize="xs">
                Rate:
              </Text>
              <Text color="textPrimary" fontSize="xs">
                {rate || '-'}
              </Text>
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Text color="gray.400" fontSize="xs">
                Routing:
              </Text>
              <Flex alignItems="center" gap={1}>
                {isLoadingCost && (
                  <Loader size="xs" ml="auto" color="gray.400" />
                )}
                {!isLoadingCost &&
                  pools.map((pool, i) => (
                    <Flex alignItems="center" gap={0} key={String(pool) + i}>
                      <SwapRouteItem pool={pool} />
                      {i !== pools.length - 1 && (
                        <Text as="span" fontSize="xs" color="textPrimary">
                          +
                        </Text>
                      )}
                    </Flex>
                  ))}
                {!pools.length && !isLoadingCost && (
                  <Text color="textPrimary" fontSize="xs">
                    -
                  </Text>
                )}
              </Flex>
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Text color="gray.400" fontSize="xs">
                Estimated fees:
              </Text>
              <Text color="textPrimary" fontSize="xs">
                {isLoadingCost && (
                  <Loader size="xs" ml="auto" color="gray.400" />
                )}
                {!isLoadingCost && fee}
              </Text>
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Text color="gray.400" fontSize="xs">
                Gas cost:
              </Text>
              {isLoadingCost && <Loader size="xs" ml="auto" color="gray.400" />}

              {!isLoadingCost && (
                <Text color="textPrimary" fontSize="xs">
                  {cost}
                </Text>
              )}
            </Flex>
          </Stack>
        )}
      </ExpandableCardSection>
      <ExpandableCardSection isExpanded={isCurrentStep} type="footer">
        {children}
      </ExpandableCardSection>
    </Card.Root>
  );
});
