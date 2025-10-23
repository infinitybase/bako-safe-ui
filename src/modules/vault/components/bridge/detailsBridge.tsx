import { Button, Card, Heading, HStack, Loader, Text, VStack } from 'bako-ui';
import { useEffect, useMemo } from 'react';

import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';
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
    isFormComplete,
    errorForm,
    isPendingSigner,
    isLoadingQuote,
    isSendingTx,
    getReceiveQuoteMobile,
  } = useFormBridge();

  const { stepForm } = useFormBridgeContext();

  const isExpanded = stepForm >= BridgeStepsForm.RESUME;

  const notEnoughBalanceETH = useMemo(() => {
    return assets?.isEthBalanceLowerThanReservedAmount;
  }, [assets]);

  useEffect(() => {
    if (dataQuote.receiveInUsd !== '-') return;
    getReceiveQuoteMobile();
  }, [dataQuote.receiveInUsd, getReceiveQuoteMobile]);

  return (
    <Card.Root variant="subtle" w="458px" bg="bg.panel" rounded="2xl">
      <Card.Header pb={!isExpanded ? 6 : 0}>
        <Heading color="textPrimary" fontSize="sm">
          Resume
        </Heading>
      </Card.Header>
      <ExpandableCardSection
        isExpanded={isExpanded}
        type="body"
        maxHeight="300px"
      >
        <VStack p={0} gap={0}>
          <HStack width="full">
            <HStack gap={2} align={'center'}>
              <Text color="gray.400" fontSize={12} flex={1}>
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
              <Text color="gray.400" fontSize={12}>
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
                  fontSize={12}
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
            <Text color="gray.400" fontSize={12}>
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
                    fontSize={14}
                    textAlign="right"
                  >
                    {dataQuote?.quote?.receiveAmount
                      ? dataQuote?.quote?.receiveAmount + ' ' + assetTo?.symbol
                      : ''}
                  </Text>
                  <Text color="textPrimary" fontSize={12} textAlign="right">
                    {dataQuote?.receiveInUsd
                      ? `(${dataQuote?.receiveInUsd})`
                      : '-'}
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
            notEnoughBalanceETH
          }
          loading={isSendingTx}
          fontWeight={600}
          fontSize={16}
          letterSpacing={'2%'}
          type="submit"
          mt={4}
          // onClick={() => setScreenBridge('resume')}
        >
          {isPendingSigner
            ? TitleButtonsForm.PENDING_TX
            : notEnoughBalanceETH
              ? TitleButtonsForm.INSUFFICIENT_ETH
              : TitleButtonsForm.BRIDGE}
        </Button>
      </ExpandableCardSection>
    </Card.Root>
  );
}
