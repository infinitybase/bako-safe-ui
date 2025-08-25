import { Card, HStack, Icon, Text, VStack } from '@chakra-ui/react';

import { DoubtIcon } from '@/components/icons/doubt';

export interface DetailsBridgeProps {
  bgColor?: string;
  padding?: number;
}

export function DetailsBridge({
  bgColor = 'grey.825',
  padding = 3,
}: DetailsBridgeProps) {
  return (
    <Card variant="outline" padding={padding} bgColor={bgColor}>
      <VStack p={0} gap={0}>
        <HStack width="full">
          <HStack gap={2} align={'center'}>
            <Text color="#AAA6A1" fontSize={12} flex={1}>
              Estimated time
            </Text>
          </HStack>
          <Text color="#AAA6A1" fontSize={12} flex={1} align="right">
            1 minute
          </Text>
        </HStack>
        <HStack width="full">
          <HStack>
            <Text color="#AAA6A1" fontSize={12}>
              Fee
            </Text>
            <Icon color="grey.75" fontSize="14px" as={DoubtIcon} />
          </HStack>
          <Text color="#AAA6A1" fontSize={12} flex={1} align="right">
            {'0.000035 ETH'}
          </Text>
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
          >
            <Text color="grey.50" fontWeight={600} fontSize={14} align="right">
              0.52123 ETH
            </Text>
            <Text color="#AAA6A1" fontSize={12} align="right">
              {`($989.78)`}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Card>
  );
}
