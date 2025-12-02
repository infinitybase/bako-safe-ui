import { Button, Card, Heading, HStack, Loader, Text, VStack } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';
import { AssetsResume } from './assetsResume';
import { ExpandableCardSection } from './ExpandableCardSection';
import { useFormBridgeContext } from './providers/FormBridgeProvider';
import { BridgeStepsForm, TitleButtonsForm } from './utils';

export interface DetailsBridgeProps {
  assets?: UseVaultDetailsReturn['assets'];
}

export function DetailsBridge({ assets }: DetailsBridgeProps) {
  const {
    dataQuote,
    assetFrom,
    assetTo,
    networkTo,
    isFormComplete,
    errorForm,
    isPendingSigner,
    isLoadingQuote,
    isSendingTx,
    isLoading,
    amount,
  } = useFormBridge();
  const { assetsMap, tokensUSD } = useWorkspaceContext();
  const { stepForm } = useFormBridgeContext();

  const isExpanded = stepForm >= BridgeStepsForm.RESUME;

  const notEnoughBalanceETH = useMemo(() => {
    return assets?.isEthBalanceLowerThanReservedAmount;
  }, [assets]);

  const balance = useMemo(() => {
    const asset = assets?.assets?.find((a) => a.assetId === assetFrom?.value);
    if (!asset?.amount) return '0';

    const assetsInfo = assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];

    return bn(asset.amount)?.format({
      units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
    });
  }, [assets, assetFrom?.value, assetsMap]);

  const isEnoughETH = useMemo(() => {
    const fee = dataQuote?.quote?.totalFee * 2;
    if (!fee) return true;

    const maxAmount = Number(balance) - fee;

    return maxAmount > Number(amount);
  }, [balance, amount, dataQuote?.quote?.totalFee]);

  const receiveInUsd = useMemo(() => {
    if (!assetFrom) return null;
    const usdData = tokensUSD.data[assetFrom?.value];
    const usdAmount = usdData?.usdAmount ?? null;
    if (!usdAmount || !dataQuote?.quote) return null;
    const receiveValue = usdAmount * dataQuote?.quote?.receiveAmount;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(receiveValue);
  }, [dataQuote, tokensUSD, assetFrom]);

  const showEnoughETHWarning = useMemo(
    () =>
      (!isEnoughETH && stepForm >= BridgeStepsForm.RESUME) ||
      notEnoughBalanceETH,
    [isEnoughETH, stepForm, notEnoughBalanceETH],
  );

  return (
    <Card.Root variant="subtle" w="full" bg="bg.panel" rounded="2xl">
      <Card.Header pb={!isExpanded ? 6 : 0}>
        <Heading
          color={isExpanded ? 'textPrimary' : 'textSecondary'}
          fontSize="sm"
        >
          Resume
        </Heading>
      </Card.Header>
      <ExpandableCardSection
        isExpanded={isExpanded}
        type="body"
        maxHeight="300px"
      >
        <VStack gap={1}>
          {assetTo && assetFrom && (
            <AssetsResume
              toAsset={assetTo}
              toNetwork={networkTo}
              fromAsset={assetFrom}
            />
          )}
          <HStack width="full">
            <HStack gap={2} align={'center'}>
              <Text
                color="gray.400"
                lineHeight="shorter"
                fontSize="xs"
                flex={1}
              >
                Estimated time
              </Text>
            </HStack>
            <HStack
              w={'full'}
              flex={1}
              textAlign={'right'}
              justifyContent={'flex-end'}
            >
              {isLoadingQuote ? (
                <Loader color="textPrimary" size="xs" />
              ) : (
                <Text
                  color="textPrimary"
                  lineHeight="shorter"
                  fontSize={12}
                  flex={1}
                  textAlign="right"
                >
                  {dataQuote?.quote?.avgCompletionTime ?? '-'}
                </Text>
              )}
            </HStack>
          </HStack>
          <HStack width="full">
            <HStack>
              <Text color="gray.400" lineHeight="shorter" fontSize="xs">
                Fee
              </Text>
            </HStack>
            <HStack
              w={'full'}
              flex={1}
              textAlign={'right'}
              justifyContent={'flex-end'}
            >
              {isLoadingQuote ? (
                <Loader color="textPrimary" size="xs" />
              ) : (
                <Text
                  color="textPrimary"
                  lineHeight="shorter"
                  fontSize="xs"
                  flex={1}
                  textAlign="right"
                >
                  {dataQuote?.quote?.totalFee
                    ? dataQuote?.quote?.totalFee + ' ' + assetFrom?.symbol
                    : '-'}
                </Text>
              )}
            </HStack>
          </HStack>
          <HStack width="full">
            <Text color="gray.400" lineHeight="shorter" fontSize="xs">
              You will receive
            </Text>
            <HStack
              w={'full'}
              flex={1}
              textAlign={'right'}
              justifyContent={'flex-end'}
              minH={'21px'}
            >
              {isLoadingQuote ? (
                <Loader color="textPrimary" size="xs" />
              ) : (
                <>
                  <Text
                    color="gray.50"
                    fontWeight={600}
                    fontSize="xs"
                    textAlign="right"
                  >
                    {dataQuote?.quote?.receiveAmount
                      ? dataQuote?.quote?.receiveAmount + ' ' + assetTo?.symbol
                      : ''}
                  </Text>
                  <Text color="textPrimary" fontSize="xs" textAlign="right">
                    {receiveInUsd ? `(${receiveInUsd})` : '-'}
                  </Text>
                </>
              )}
            </HStack>
          </HStack>
        </VStack>
      </ExpandableCardSection>

      <ExpandableCardSection
        isExpanded={isExpanded}
        type="footer"
        maxHeight="120px"
      >
        <Button
          disabled={
            !isFormComplete ||
            !!errorForm ||
            isPendingSigner ||
            notEnoughBalanceETH ||
            !isEnoughETH
          }
          loading={isSendingTx || isLoading}
          fontWeight={600}
          fontSize={14}
          letterSpacing={'2%'}
          type="submit"
          mt={4}
        >
          {isPendingSigner
            ? TitleButtonsForm.PENDING_TX
            : showEnoughETHWarning
              ? TitleButtonsForm.INSUFFICIENT_ETH
              : TitleButtonsForm.BRIDGE}
        </Button>
      </ExpandableCardSection>
    </Card.Root>
  );
}
