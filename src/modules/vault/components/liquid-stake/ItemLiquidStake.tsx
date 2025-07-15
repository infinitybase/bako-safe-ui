import { Card, HStack, Text, VStack } from '@chakra-ui/react';

export interface ItemLiquidStakeProps {
  label: string;
  value: string;
  children?: React.ReactNode;
}

export function ItemLiquidStake({
  label,
  value,
  children,
}: ItemLiquidStakeProps) {
  return (
    <Card
      flexDirection="row"
      borderRadius={9}
      flex={1}
      alignItems="center"
      background={'var(--chakra-colors-dark-950)'}
      width="full"
    >
      <HStack
        flex={1}
        padding={3}
        background={'var(--chakra-colors-gradients-transaction-card)'}
      >
        <VStack flex={1} alignItems="flex-start" gap={0}>
          <Text fontSize={12} color={'gray'}>
            {label}
          </Text>
          <Text fontSize={16} fontWeight={700} color="white">
            {value}
          </Text>
        </VStack>
        {children}
      </HStack>
    </Card>
  );
}
