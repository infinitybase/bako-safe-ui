import { Card, HStack, Text, VStack } from '@chakra-ui/react';

import { CustomSkeleton } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';

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
  const {
    screenSizes: { isMobile, isLargerThan1600 },
  } = useWorkspaceContext();

  const charLimit = isLargerThan1600 || isMobile ? 20 : 13;

  return (
    <Card
      flexDirection="row"
      borderRadius={9}
      flex={1}
      alignItems="center"
      background={'var(--chakra-colors-dark-950)'}
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
          <CustomSkeleton isLoaded={!isLoading}>
            <Text fontSize={16} fontWeight={700} color="white">
              {limitCharacters(value, charLimit)}
            </Text>
          </CustomSkeleton>
        </VStack>
        {children}
      </HStack>
    </Card>
  );
}
