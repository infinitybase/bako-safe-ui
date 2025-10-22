import { Card, HStack, Loader, Text, VStack } from 'bako-ui';
import { useEffect } from 'react';

import { useFormBridge } from '../../hooks/bridge';

export interface DetailsBridgeProps {
  bgColor?: string;
  padding?: number;
}

export function DetailsBridge({
  bgColor = 'grey.825',
  padding = 3,
}: DetailsBridgeProps) {
  const {
    dataQuote,
    assetFrom,
    assetTo,
    isLoadingQuote,
    getReceiveQuoteMobile,
  } = useFormBridge();

  useEffect(() => {
    if (dataQuote.receiveInUsd !== '-') return;
    getReceiveQuoteMobile();
  }, [dataQuote.receiveInUsd, getReceiveQuoteMobile]);

  return (
    <Card.Root variant="subtle" padding={padding} bgColor={bgColor}>
      <VStack p={0} gap={0}>
        <HStack width="full">
          <HStack gap={2} align={'center'}>
            <Text color="grey.250" fontSize={12} flex={1}>
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
              <Loader color="grey.500" size="xs" />
            ) : (
              <Text color="grey.250" fontSize={12} flex={1} textAlign="right">
                {dataQuote?.quote?.avgCompletionTime ?? '-'}
              </Text>
            )}
          </HStack>
        </HStack>
        <HStack width="full">
          <HStack>
            <Text color="grey.250" fontSize={12}>
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
              <Loader color="grey.500" size="xs" />
            ) : (
              <Text color="grey.250" fontSize={12} flex={1} textAlign="right">
                {dataQuote?.quote?.totalFee
                  ? dataQuote?.quote?.totalFee + ' ' + assetFrom?.symbol
                  : '-'}
              </Text>
            )}
          </HStack>
        </HStack>
        <HStack width="full">
          <Text color="grey.250" fontSize={12}>
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
              <Loader color="grey.500" size="xs" />
            ) : (
              <>
                <Text
                  color="grey.50"
                  fontWeight={600}
                  fontSize={14}
                  textAlign="right"
                >
                  {dataQuote?.quote?.receiveAmount
                    ? dataQuote?.quote?.receiveAmount + ' ' + assetTo?.symbol
                    : ''}
                </Text>
                <Text color="grey.250" fontSize={12} textAlign="right">
                  {dataQuote?.receiveInUsd
                    ? `(${dataQuote?.receiveInUsd})`
                    : '-'}
                </Text>
              </>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Card.Root>
  );
}
