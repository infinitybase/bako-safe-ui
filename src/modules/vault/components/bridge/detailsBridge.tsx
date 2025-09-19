import { Card, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';

import { DoubtIcon } from '@/components/icons/doubt';

import { useFormBridge } from '../../hooks/bridge';

export interface DetailsBridgeProps {
  bgColor?: string;
  padding?: number;
}

export function DetailsBridge({
  bgColor = 'grey.825',
  padding = 3,
}: DetailsBridgeProps) {
  const { dataQuote, assetFrom, assetTo, isLoadingQuote } = useFormBridge();

  return (
    <Card variant="outline" padding={padding} bgColor={bgColor}>
      <VStack p={0} gap={0}>
        <HStack width="full">
          <HStack gap={2} align={'center'}>
            <Text color="#AAA6A1" fontSize={12} flex={1}>
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
              <Spinner color="grey.500" size="xs" />
            ) : (
              <Text color="#AAA6A1" fontSize={12} flex={1} align="right">
                {dataQuote?.quote?.avg_completion_time ?? '-'}
              </Text>
            )}
          </HStack>
        </HStack>
        <HStack width="full">
          <HStack>
            <Text color="#AAA6A1" fontSize={12}>
              Fee
            </Text>
            <Icon color="grey.75" fontSize="14px" as={DoubtIcon} />
          </HStack>
          <HStack
            w={'full'}
            flex={1}
            textAlign={'right'}
            justifyContent={'flex-end'}
          >
            {isLoadingQuote ? (
              <Spinner color="grey.500" size="xs" />
            ) : (
              <Text color="#AAA6A1" fontSize={12} flex={1} align="right">
                {dataQuote?.quote?.total_fee
                  ? dataQuote?.quote?.total_fee + ' ' + assetFrom?.symbol
                  : '-'}
              </Text>
            )}
          </HStack>
        </HStack>
        <HStack width="full">
          <Text color="#AAA6A1" fontSize={12}>
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
              <Spinner color="grey.500" size="xs" />
            ) : (
              <>
                <Text
                  color="grey.50"
                  fontWeight={600}
                  fontSize={14}
                  align="right"
                >
                  {dataQuote?.quote?.receive_amount
                    ? dataQuote?.quote?.receive_amount + ' ' + assetTo?.symbol
                    : ''}
                </Text>
                <Text color="#AAA6A1" fontSize={12} align="right">
                  {dataQuote?.receive_in_usd
                    ? `(${dataQuote?.receive_in_usd})`
                    : '-'}
                </Text>
              </>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Card>
  );
}
