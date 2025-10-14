import { Card, HStack, Text, VStack } from 'bako-ui';

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
    <Card.Root
      flexDirection="row"
      borderRadius={9}
      flex={1}
      alignItems="center"
      bg="dark.950"
      css={{
        background: 'var(--chakra-colors-dark-950)',
      }}
      width="full"
      minW={value.length > 9 ? '235px' : '140px'}
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
          <CustomSkeleton loading={isLoading}>
            <Text fontSize={16} fontWeight={700} color="white">
              {value}
            </Text>
          </CustomSkeleton>
        </VStack>
        {children}
      </HStack>
    </Card.Root>
  );
}
