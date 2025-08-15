import { Card, HStack, Text, VStack } from '@chakra-ui/react';

import { CustomSkeleton } from '@/components';

export interface ItemLiquidStakeProps {
  label: string;
  value: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function ItemLiquidStake({
  label,
  value,
  children,
  isLoading = false,
}: ItemLiquidStakeProps) {
  return (
    <Card
      flexDirection="row"
      borderRadius={9}
      flex={1}
      alignItems="center"
      background={'var(--chakra-colors-dark-950)'}
      width="full"
      minW={value.length > 9 ? '225px' : '150px'}
    >
      <HStack
        flex={1}
        padding={3}
        borderRadius={9}
        background={'var(--chakra-colors-gradients-transaction-card)'}
      >
        <VStack flex={1} alignItems="flex-start" gap={0}>
          <Text fontSize={12} color={'gray'}>
            {label}
          </Text>
          <CustomSkeleton isLoaded={!isLoading}>
            <Text fontSize={16} fontWeight={700} color="white">
              {value}
            </Text>
          </CustomSkeleton>
        </VStack>
        {children}
      </HStack>
    </Card>
  );
}
